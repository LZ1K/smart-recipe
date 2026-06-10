import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const preferences = await prisma.userPreference.findMany({
    where: { userId: session.user.id },
    orderBy: { type: "asc" },
  })

  return NextResponse.json(preferences)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { type, value } = await req.json()

  const exists = await prisma.userPreference.findFirst({
    where: { userId: session.user.id, type, value },
  })

  if (exists) {
    return NextResponse.json(exists)
  }

  const pref = await prisma.userPreference.create({
    data: { userId: session.user.id, type, value, source: "manual" },
  })

  return NextResponse.json(pref, { status: 201 })
}
