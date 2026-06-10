import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const category = searchParams.get("category") || undefined

  const recipes = await prisma.recipe.findMany({
    where: {
      ...(search ? { name: { contains: search } } : {}),
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(recipes)
}
