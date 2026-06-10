import { notFound } from "next/navigation"
import Image from "next/image"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FavoriteButton } from "@/components/ui/favorite-button"
import { Clock, Users, ChefHat, AlertTriangle, UtensilsCrossed } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    include: { category: true },
  })

  const favorite = session?.user?.id
    ? await prisma.favorite.findFirst({
        where: { userId: session.user.id!, recipe: { slug } },
      })
    : null

  if (!recipe) notFound()

  const ingredients = recipe.ingredients as Array<{
    name: string; amount: string; substitute?: string
  }>
  const steps = recipe.steps as Array<{ order: number; text: string; tip?: string }>
  const nutrition = recipe.nutrition as Record<string, number> | null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Badge variant="secondary" className="mb-3">{recipe.category.name}</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#5C3D2E] mb-3">{recipe.name}</h1>
        <p className="text-[#8B7355] text-lg leading-relaxed mb-4">{recipe.description}</p>
        <div className="flex items-center gap-4 text-sm text-[#8B7355] flex-wrap">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{recipe.cookingTime}分钟</span>
          <span className="flex items-center gap-1"><ChefHat className="h-4 w-4" />{recipe.difficulty}</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />{recipe.servings}人份</span>
        </div>
        <div className="mt-3">
          <FavoriteButton recipeId={recipe.id} isFavorited={!!favorite} />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-[#E8D5C4]">{tag}</Badge>
          ))}
        </div>
      </div>

      {recipe.imageUrl && (
        <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-8 border border-[#E8D5C4]">
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <Separator className="bg-[#E8D5C4] mb-8" />

      {/* Ingredients */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-[#5C3D2E] mb-4 flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-[#E07B3C]" />
          食材清单
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {ingredients.map((ing, i) => (
            <div key={`${ing.name}-${i}`} className="flex items-center justify-between p-2 px-3 rounded-lg bg-[#FDF2E9] text-sm">
              <span className="text-[#3D2C1E]">{ing.name}</span>
              <span className="text-[#8B7355]">{ing.amount}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-[#5C3D2E] mb-4">烹饪步骤</h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.order} className="flex gap-4 p-4 rounded-lg bg-white border border-[#E8D5C4]">
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#E07B3C] text-white text-sm font-bold">
                {step.order}
              </div>
              <div>
                <p className="text-[#3D2C1E] text-sm leading-relaxed">{step.text}</p>
                {step.tip && (
                  <p className="text-xs text-[#8B7355] mt-1 italic">小贴士：{step.tip}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      {recipe.commonMistakes.length > 0 && (
        <section className="mb-8">
          <h2 className="font-heading text-xl text-[#5C3D2E] mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#F4A261]" />
            常见问题
          </h2>
          <div className="space-y-2">
            {recipe.commonMistakes.map((tip, i) => (
              <div key={`mistake-${i}`} className="flex items-start gap-2 text-sm text-[#8B7355]">
                <span className="mt-0.5 text-[#F4A261]">!</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nutrition */}
      {nutrition && (
        <section className="mb-8">
          <h2 className="font-heading text-xl text-[#5C3D2E] mb-4">营养信息</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "热量", value: nutrition.calories, unit: "kcal" },
              { label: "蛋白质", value: nutrition.protein, unit: "g" },
              { label: "脂肪", value: nutrition.fat, unit: "g" },
              { label: "碳水", value: nutrition.carbs, unit: "g" },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-lg bg-[#FDF2E9]">
                <div className="text-lg font-bold text-[#E07B3C]">{item.value}</div>
                <div className="text-xs text-[#8B7355]">{item.label}({item.unit})</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pairings */}
      {recipe.pairings.length > 0 && (
        <section>
          <h2 className="font-heading text-xl text-[#5C3D2E] mb-4">推荐搭配</h2>
          <div className="flex gap-2 flex-wrap">
            {recipe.pairings.map((p) => (
              <Badge key={p} className="bg-[#FDF2E9] text-[#5C3D2E] hover:bg-[#F5E6D3] px-4 py-1.5">{p}</Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
