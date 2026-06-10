import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PreferenceSchema } from "@/lib/validations"

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

  const body = await req.json()
  const parsed = PreferenceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { type, value } = parsed.data

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
