import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { streamChatCompletion } from "@/lib/deepseek"
import { ChatMessageSchema } from "@/lib/validations"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { message: rawMessage, conversationId } = await req.json()
  const parsed = ChatMessageSchema.safeParse({ message: rawMessage, conversationId: conversationId ?? undefined })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const message = parsed.data.message

  // Find or create conversation
  let conversation
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId: session.user.id },
    })
  }
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId: session.user.id, title: message.slice(0, 30) },
    })
  }

  // Save user message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: message,
    },
  })

  // Load context: recent 10 messages + preferences
  const [recentMessages, preferences] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.userPreference.findMany({
      where: { userId: session.user.id },
    }),
  ])

  const tastePrefs = preferences.filter((p) => p.type === "TASTE").map((p) => p.value)
  const favoritePrefs = preferences.filter((p) => p.type === "FAVORITE").map((p) => p.value)
  const avoidancePrefs = preferences.filter((p) => p.type === "AVOIDANCE").map((p) => p.value)
  const allergyPrefs = preferences.filter((p) => p.type === "ALLERGY").map((p) => p.value)

  const systemPrompt = `你是「小菜」，一个热情专业的智能菜谱助手。

## 用户偏好
- 口味偏好（酸甜/咸鲜/辣/清淡等）：${tastePrefs.length > 0 ? tastePrefs.join("、") : "暂无记录"}
- 喜爱食材：${favoritePrefs.length > 0 ? favoritePrefs.join("、") : "暂无记录"}
- 忌口食材：${avoidancePrefs.length > 0 ? avoidancePrefs.join("、") : "暂无记录"}
- 过敏源：${allergyPrefs.length > 0 ? allergyPrefs.join("、") : "暂无记录"}

## 食材关联规则
- "辣"是口味偏好，"辣椒"是食材忌口，两者相关但不相等
- 用户说"不吃辣/不喜欢辣味" → 仅指口味，青椒/甜椒/彩椒（不辣）正常推荐
- 用户说"不吃辣椒" → 忌口辣椒，需主动追问"那青椒、甜椒、彩椒呢？"
- 如果用户确认吃青椒/甜椒 → 只忌辣椒
- 如果用户连青椒/甜椒/彩椒也不吃 → 忌口升级为范围更广的"不吃辣椒类"

## 回复要求
1. 用亲切友好的中文回复，像一个懂烹饪的朋友
2. 推荐菜谱时严格避开忌口食材和过敏源，优先推荐喜爱食材
3. 口味偏好用于排序（优先推荐辣口用户的辣菜，清淡口用户的清淡菜）
4. 如果用户提到不吃的食材，主动追问相关联的食材（如：不吃辣椒，追问是否吃青椒/甜椒）
5. 回复不要过长，一次5-10句话即可`

  const chatMessages = [
    { role: "system" as const, content: systemPrompt },
    ...recentMessages.slice().reverse().map((m) => ({
      role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
      content: m.content,
    })),
  ]

  // Stream response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await streamChatCompletion(chatMessages, { temperature: 0.7 })

        let fullResponse = ""
        for await (const chunk of aiStream) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            fullResponse += content
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content, conversationId: conversation.id })}\n\n`)
            )
          }
        }

        // Save assistant message
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: "assistant",
            content: fullResponse,
          },
        })

        // Update conversation title based on first exchange
        const messageCount = await prisma.message.count({ where: { conversationId: conversation.id } })
        if (messageCount <= 2) {
          await prisma.conversation.update({
            where: { id: conversation.id },
            data: { title: message.slice(0, 20) },
          })
        }

        // Extract preferences asynchronously
        try {
          const { chatCompletion } = await import("@/lib/deepseek")
          const extractResult = await chatCompletion(
            [
              {
                role: "system",
                content: `从用户消息中提取饮食偏好，严格按以下规则分类，返回JSON：
{"preferences":[{"type":"...","value":"...","confidence":0.0-1.0}]}

## type 分类规则（重要！）
- TASTE：口味风格——辣口、酸甜口、咸鲜口、清淡口、麻口、甜口、酸口、酱香口。例如"爱吃辣"→TASTE:"辣口"
- FAVORITE：喜爱的具体食材——鸡蛋、番茄、豆腐、土豆、鸡肉。例如"爱吃鸡蛋"→FAVORITE:"鸡蛋"
- AVOIDANCE：忌口的食材——辣椒、香菇、香菜、大蒜、姜、花椒。例如"不吃辣椒"→AVOIDANCE:"辣椒"
- ALLERGY：过敏源——花生、海鲜、牛奶、虾。例如"花生过敏"→ALLERGY:"花生"

## 区分要点（非常重要）
- "不爱吃辣"/"不喜欢辣味"=口味偏好→TASTE:"辣口"（仅指辣味，不限制青椒/甜椒/彩椒等不辣食材）
- "不吃辣椒"/"忌辣椒"=食材忌口→AVOIDANCE:"辣椒"（指辣椒本身）
- "爱吃鸡蛋"=食材→FAVORITE:"鸡蛋"，不是TASTE
- "不吃青椒/甜椒/彩椒"=忌口所有辣椒类→AVOIDANCE 逐条记录："辣椒""青椒""甜椒""彩椒"
- 用户没明确说的不要提取，confidence<0.7的不输出
- value要统一用中文简称，如"辣口"不说"喜欢吃辣的口味"`,
              },
              { role: "user", content: message },
            ],
            { temperature: 0.3, jsonMode: true }
          )

          const raw = extractResult.replace(/```(?:json)?\s*/g, "").replace(/```\s*$/g, "").trim()
          const parsed2 = JSON.parse(raw)
          if (parsed2.preferences?.length > 0) {
            const newPrefs = parsed2.preferences.filter(
              (p: { type: string; value: string; confidence: number }) =>
                p.confidence >= 0.7 && p.type && p.value
            )
            const uid = session.user!.id!
            for (const pref of newPrefs) {
              const exists = await prisma.userPreference.findFirst({
                where: {
                  userId: uid,
                  type: pref.type,
                  value: pref.value,
                },
              })
              if (!exists) {
                await prisma.userPreference.create({
                  data: {
                    user: { connect: { id: uid } },
                    type: pref.type,
                    value: pref.value,
                    source: "ai_extract",
                    confidence: pref.confidence,
                  },
                })
              }
            }
            if (newPrefs.length > 0) {
              const allPrefs = await prisma.userPreference.findMany({
                where: { userId: uid },
                orderBy: { type: "asc" },
              })
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ preferences: allPrefs })}\n\n`)
              )
            }
          }
        } catch (err) {
          // Preferences extraction is non-blocking, ignore errors
          console.error("Preference extraction error:", err)
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      } catch (error) {
        console.error("Stream error:", error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content: "\n\n抱歉，出错了，请稍后重试。" })}\n\n`)
        )
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
