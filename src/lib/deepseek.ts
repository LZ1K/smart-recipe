import OpenAI from "openai"

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
})

const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat"

type ChatRole = "system" | "user" | "assistant"

interface ChatMessage {
  role: ChatRole
  content: string
}

export async function chatCompletion(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
) {
  const response = await deepseek.chat.completions.create({
    model: MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2048,
    response_format: options?.jsonMode
      ? { type: "json_object" }
      : undefined,
  })

  return response.choices[0]?.message?.content ?? ""
}

export async function streamChatCompletion(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
) {
  const stream = await deepseek.chat.completions.create({
    model: MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2048,
    stream: true,
  })

  return stream
}

export { deepseek, MODEL }
