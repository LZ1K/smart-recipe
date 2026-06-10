import { NextResponse } from "next/server"
import {
  getCurrentSeasonIngredients,
  detectPriceAnomalies,
  generateSeasonalAdjustments,
} from "@/lib/seasonal-data"

export async function GET() {
  try {
    const [ingredients, priceAlerts, adjustments] = await Promise.all([
      getCurrentSeasonIngredients(),
      detectPriceAnomalies(),
      Promise.resolve(generateSeasonalAdjustments()),
    ])

    return NextResponse.json({
      season: adjustments.rule,
      reason: adjustments.reason,
      ingredients,
      priceAlerts,
      recommendedCategories: adjustments.recommendedCategories,
      seasonalIngredients: adjustments.seasonalIngredients,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("季节数据获取失败:", error)
    return NextResponse.json(
      { error: "数据获取失败", ingredients: [], priceAlerts: [], season: "未知" },
      { status: 500 }
    )
  }
}
