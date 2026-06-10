import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { RecipeCard } from "@/components/ui/recipe-card"
import { Heart } from "lucide-react"

interface FavRecipe {
  id: string
  recipe: {
    slug: string
    name: string
    description: string
    cookingTime: number
    difficulty: string
    servings: number
    tags: string[]
    imageUrl: string | null
    category: { name: string }
  }
}

export const dynamic = "force-dynamic"

export default async function FavoritesPage() {
  const session = await auth()

  const favorites: FavRecipe[] = await prisma.favorite.findMany({
    where: { userId: session!.user!.id! },
    include: { recipe: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-3xl text-[#5C3D2E] mb-2">收藏夹</h1>
      <p className="text-[#8B7355] mb-8">
        {favorites.length > 0
          ? `共收藏了 ${favorites.length} 道菜谱`
          : "收藏你喜欢的菜谱，随时查看"}
      </p>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="mx-auto h-12 w-12 text-[#E8D5C4] mb-4" />
          <p className="text-[#8B7355] mb-2">还没有收藏任何菜谱</p>
          <p className="text-sm text-[#8B7355]">
            去<a href="/recipes" className="text-[#E07B3C] hover:underline">菜谱库</a>逛逛，点击心形图标即可收藏
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((fav) => (
            <RecipeCard
              key={fav.id}
              slug={fav.recipe.slug}
              name={fav.recipe.name}
              description={fav.recipe.description}
              cookingTime={fav.recipe.cookingTime}
              difficulty={fav.recipe.difficulty}
              servings={fav.recipe.servings}
              tags={fav.recipe.tags}
              category={fav.recipe.category.name}
              imageUrl={fav.recipe.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}
