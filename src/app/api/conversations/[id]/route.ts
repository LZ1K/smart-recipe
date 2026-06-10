import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!conversation) {
    return NextResponse.json({ error: "对话不存在" }, { status: 404 })
  }

  return NextResponse.json(conversation)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!conversation) {
    return NextResponse.json({ error: "对话不存在" }, { status: 404 })
  }

  await prisma.conversation.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
