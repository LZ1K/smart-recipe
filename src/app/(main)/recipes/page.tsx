import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { RecipeCard } from "@/components/ui/recipe-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  const { search, category } = await searchParams

  const [categories, recipes] = await Promise.all([
    prisma.recipeCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.recipe.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(search
          ? { name: { contains: search } }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-3xl text-[#5C3D2E] mb-2">菜谱库</h1>
      <p className="text-[#8B7355] mb-8">探索 20 道经典中式菜谱，找到你的心头好</p>

      {/* Search */}
      <form className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B7355]" />
        <Input
          name="search"
          placeholder="搜索菜谱..."
          defaultValue={search}
          className="pl-10 border-[#E8D5C4]"
        />
      </form>

      {/* Categories filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Link
          href="/recipes"
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            !category
              ? "bg-[#E07B3C] text-white"
              : "bg-[#FDF2E9] text-[#8B7355] hover:text-[#E07B3C]"
          }`}
        >
          全部
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/recipes?category=${cat.slug}`}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              category === cat.slug
                ? "bg-[#E07B3C] text-white"
                : "bg-[#FDF2E9] text-[#8B7355] hover:text-[#E07B3C]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 text-[#8B7355]">
          <p className="text-lg">没有找到相关菜谱</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              slug={r.slug}
              name={r.name}
              description={r.description}
              cookingTime={r.cookingTime}
              difficulty={r.difficulty}
              servings={r.servings}
              tags={r.tags}
              category={r.category.name}
              imageUrl={r.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}
