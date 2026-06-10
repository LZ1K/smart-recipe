import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params
  const pref = await prisma.userPreference.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!pref) {
    return NextResponse.json({ error: "偏好不存在" }, { status: 404 })
  }

  await prisma.userPreference.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
