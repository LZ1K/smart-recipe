import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { recipe: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(favorites)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { recipeId } = await req.json()
  if (!recipeId) {
    return NextResponse.json({ error: "缺少 recipeId" }, { status: 400 })
  }

  const exists = await prisma.favorite.findUnique({
    where: { userId_recipeId: { userId: session.user.id, recipeId } },
  })

  if (exists) {
    return NextResponse.json(exists)
  }

  const favorite = await prisma.favorite.create({
    data: { userId: session.user.id, recipeId },
  })

  return NextResponse.json(favorite, { status: 201 })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { recipeId } = await req.json()

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, recipeId },
  })

  return NextResponse.json({ success: true })
}
