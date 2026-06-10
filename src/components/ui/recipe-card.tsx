import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChefHat } from "lucide-react"

interface RecipeCardProps {
  slug: string
  name: string
  description: string
  cookingTime: number
  difficulty: string
  servings: number
  tags: string[]
  category: string
  imageUrl?: string | null
}

export function RecipeCard({
  slug,
  name,
  description,
  cookingTime,
  difficulty,
  servings,
  tags,
  category,
  imageUrl,
}: RecipeCardProps) {
  return (
    <Link href={`/recipes/${slug}`}>
      <Card className="card-paper overflow-hidden border-[#E8D5C4] hover:border-[#E07B3C] hover:shadow-md transition-all h-full">
        <div className="relative h-36 bg-gradient-to-br from-[#E07B3C] via-[#F4A261] to-[#F5E6D3]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ChefHat className="h-12 w-12 text-white/80" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-heading text-lg text-[#5C3D2E]">{name}</h3>
            <Badge variant="secondary" className="text-xs">{category}</Badge>
          </div>
          <p className="text-sm text-[#8B7355] line-clamp-2 mb-3">{description}</p>
          <div className="flex items-center gap-3 text-xs text-[#8B7355]">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cookingTime}分钟</span>
            <span className="flex items-center gap-1"><ChefHat className="h-3 w-3" />{difficulty}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{servings}人份</span>
          </div>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] border-[#E8D5C4] text-[#8B7355]">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
