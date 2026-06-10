import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!recipe) {
    return NextResponse.json({ error: "菜谱不存在" }, { status: 404 })
  }

  return NextResponse.json(recipe)
}
