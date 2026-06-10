"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, TrendingDown, TrendingUp, AlertTriangle, Info } from "lucide-react"

interface SeasonalData {
  season: string
  reason: string
  ingredients: Array<{ id: string; name: string; price: number }>
  priceAlerts: Array<{
    type: "price_spike" | "price_drop"
    ingredient: string
    message: string
    suggestion: string
  }>
  recommendedCategories: string[]
  seasonalIngredients: string[]
}

export function SeasonalCard() {
  const [data, setData] = useState<SeasonalData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/external-data/seasonal")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="border-[#E8D5C4]">
        <CardContent className="p-3">
          <p className="text-xs text-[#8B7355]">加载季节数据...</p>
        </CardContent>
      </Card>
    )
  }

  if (!data?.ingredients?.length) {
    return (
      <Card className="border-[#E8D5C4]">
        <CardContent className="p-3">
          <p className="text-xs text-[#8B7355]">季节数据暂不可用</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#E8D5C4] card-paper">
      <CardContent className="p-3 space-y-3">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-[#5C3D2E]">{data.season}</span>
          </div>
          <span className="text-[10px] text-[#8B7355]">全国均价</span>
        </div>

        {/* 当季食材 + 价格 */}
        <div className="space-y-1.5">
          <p className="text-xs text-[#8B7355] font-medium">当季食材参考价（元/斤）</p>
          <div className="flex flex-wrap gap-1.5">
            {data.ingredients.slice(0, 6).map((item) => (
              <Badge
                key={item.name}
                variant="outline"
                className="text-[10px] border-[#E8D5C4] text-[#8B7355]"
              >
                {item.name} ¥{item.price}
              </Badge>
            ))}
          </div>
        </div>

        {/* 推荐分类 */}
        {data.recommendedCategories.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-[#8B7355] font-medium">优先推荐</p>
            <div className="flex gap-1 flex-wrap">
              {data.recommendedCategories.map((cat) => (
                <Badge key={cat} className="text-[10px] bg-[#E07B3C]/10 text-[#E07B3C] border-[#E07B3C]/20">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 价格异常预警 */}
        {data.priceAlerts.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#E8D5C4]">
            <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
              <AlertTriangle className="h-3 w-3" />价格波动提醒
            </div>
            {data.priceAlerts.map((alert, i) => (
              <div
                key={i}
                className={`text-xs p-2 rounded ${
                  alert.type === "price_spike"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                <div className="flex items-center gap-1 font-medium">
                  {alert.type === "price_spike" && <TrendingUp className="h-3 w-3" />}
                  {alert.type === "price_drop" && <TrendingDown className="h-3 w-3" />}
                  {alert.ingredient}
                </div>
                <p className="mt-0.5 opacity-80">{alert.message}</p>
                <p className="mt-0.5 opacity-70">{alert.suggestion}</p>
              </div>
            ))}
          </div>
        )}

        {/* 当季推荐食材 */}
        {data.seasonalIngredients.length > 0 && (
          <div className="pt-2 border-t border-[#E8D5C4]">
            <p className="text-xs text-[#8B7355] font-medium mb-1.5">当季推荐食材</p>
            <div className="flex flex-wrap gap-1">
              {data.seasonalIngredients.map((name) => (
                <Badge key={name} variant="secondary" className="text-[10px]">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 数据来源说明 */}
        <div className="pt-2 border-t border-[#E8D5C4]">
          <div className="flex items-start gap-1 text-[10px] text-[#8B7355] opacity-60">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              数据来源：全国主要城市农贸批发市场月度均价（教学演示）· 价格不含极端天气、
              节假日等短期波动因素
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
