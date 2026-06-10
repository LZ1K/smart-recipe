"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface FavoriteButtonProps {
  recipeId: string
  isFavorited: boolean
}

export function FavoriteButton({ recipeId, isFavorited }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    const method = favorited ? "DELETE" : "POST"
    const res = await fetch("/api/favorites", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId }),
    })
    if (res.ok) {
      setFavorited(!favorited)
    }
    setLoading(false)
  }

  return (
    <Button
      onClick={toggle}
      disabled={loading}
      variant={favorited ? "default" : "outline"}
      className={
        favorited
          ? "bg-[#E07B3C] hover:bg-[#D06B2C]"
          : "border-[#E8D5C4] hover:border-[#E07B3C]"
      }
      size="sm"
    >
      <Heart className={`h-4 w-4 mr-1 ${favorited ? "fill-white" : ""}`} />
      {favorited ? "已收藏" : "收藏"}
    </Button>
  )
}
