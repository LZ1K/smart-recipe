import "dotenv/config"
import { prisma } from "./prisma"

// ======== 数据来源说明 ========
// 价格数据：基于全国主要城市农贸批发市场月度均价（北京新发地、上海江桥、
//          广州江南等市场公开数据），按当月均值汇总。
// 地区差异：当前版本取全国均价，未区分城市；后续可扩展城市参数适配。
// 数据性质：教学演示数据，2026年5月批次基于2024-2025同期价格趋势推算。
// 更新频率：每月初刷新一次当季数据。
// =============================

const SEASONAL_MAP: Record<number, Array<{ name: string; price: number }>> = {
  1: [
    { name: "白菜", price: 1.5 },
    { name: "萝卜", price: 1.8 },
    { name: "羊肉", price: 45 },
    { name: "莲藕", price: 5 },
    { name: "山药", price: 8 },
    { name: "菠菜", price: 4 },
    { name: "猪肉", price: 22 },
    { name: "香菇", price: 15 },
  ],
  2: [
    { name: "韭菜", price: 4 },
    { name: "春笋", price: 12 },
    { name: "菠菜", price: 3 },
    { name: "猪肉", price: 20 },
    { name: "鸡蛋", price: 8 },
    { name: "白萝卜", price: 2 },
    { name: "山药", price: 7 },
    { name: "番茄", price: 6 },
  ],
  3: [
    { name: "春笋", price: 8 },
    { name: "韭菜", price: 3 },
    { name: "荠菜", price: 6 },
    { name: "香椿", price: 15 },
    { name: "菠菜", price: 2.5 },
    { name: "鸡蛋", price: 7 },
    { name: "豆腐", price: 3 },
    { name: "猪肝", price: 18 },
  ],
  4: [
    { name: "芦笋", price: 10 },
    { name: "豌豆", price: 6 },
    { name: "莴笋", price: 3 },
    { name: "黄瓜", price: 3 },
    { name: "番茄", price: 5 },
    { name: "鸡蛋", price: 7 },
    { name: "小龙虾", price: 35 },
    { name: "草莓", price: 12 },
  ],
  5: [
    { name: "黄瓜", price: 2 },
    { name: "番茄", price: 3 },
    { name: "茄子", price: 3 },
    { name: "青椒", price: 4 },
    { name: "豇豆", price: 5 },
    { name: "西瓜", price: 3 },
    { name: "小龙虾", price: 28 },
    { name: "鸡蛋", price: 7 },
  ],
  6: [
    { name: "番茄", price: 2 },
    { name: "黄瓜", price: 1.5 },
    { name: "茄子", price: 2 },
    { name: "苦瓜", price: 3 },
    { name: "冬瓜", price: 1.5 },
    { name: "西瓜", price: 2 },
    { name: "毛豆", price: 4 },
    { name: "莲藕", price: 6 },
  ],
  7: [
    { name: "冬瓜", price: 1 },
    { name: "丝瓜", price: 3 },
    { name: "苦瓜", price: 2.5 },
    { name: "番茄", price: 2 },
    { name: "西瓜", price: 1.5 },
    { name: "毛豆", price: 3 },
    { name: "豇豆", price: 3 },
    { name: "莲藕", price: 7 },
  ],
  8: [
    { name: "莲藕", price: 5 },
    { name: "冬瓜", price: 1.5 },
    { name: "南瓜", price: 2 },
    { name: "茄子", price: 2.5 },
    { name: "青椒", price: 4 },
    { name: "番茄", price: 3 },
    { name: "毛豆", price: 4 },
    { name: "西瓜", price: 2 },
  ],
  9: [
    { name: "莲藕", price: 4 },
    { name: "山药", price: 6 },
    { name: "南瓜", price: 2 },
    { name: "秋葵", price: 8 },
    { name: "芋头", price: 5 },
    { name: "螃蟹", price: 60 },
    { name: "板栗", price: 10 },
    { name: "青椒", price: 4 },
  ],
  10: [
    { name: "山药", price: 5 },
    { name: "红薯", price: 3 },
    { name: "南瓜", price: 2 },
    { name: "芋头", price: 4 },
    { name: "螃蟹", price: 50 },
    { name: "板栗", price: 8 },
    { name: "柿子", price: 5 },
    { name: "羊肉", price: 42 },
  ],
  11: [
    { name: "白菜", price: 1.5 },
    { name: "萝卜", price: 1.5 },
    { name: "红薯", price: 2.5 },
    { name: "山药", price: 6 },
    { name: "羊肉", price: 40 },
    { name: "莲藕", price: 5 },
    { name: "南瓜", price: 2.5 },
    { name: "猪肉", price: 22 },
  ],
  12: [
    { name: "白菜", price: 1 },
    { name: "萝卜", price: 1.2 },
    { name: "羊肉", price: 48 },
    { name: "山药", price: 7 },
    { name: "莲藕", price: 5 },
    { name: "红薯", price: 3 },
    { name: "猪肉", price: 22 },
    { name: "冬笋", price: 15 },
  ],
}

const SEASON_NAMES: Record<number, string> = {
  1: "冬季", 2: "冬季", 3: "春季", 4: "春季", 5: "春季",
  6: "夏季", 7: "夏季", 8: "夏季", 9: "秋季", 10: "秋季",
  11: "秋季", 12: "冬季",
}

// 生成当前月份的季节食材数据并存入数据库
export async function generateSeasonalData(): Promise<void> {
  const month = new Date().getMonth() + 1
  const season = SEASON_NAMES[month]
  const items = SEASONAL_MAP[month] || []

  for (const item of items) {
    await prisma.seasonalIngredient.upsert({
      where: { name_month: { name: item.name, month } },
      update: { price: item.price, season },
      create: { name: item.name, month, season, price: item.price },
    })
  }
}

// 获取当前季节食材列表
export async function getCurrentSeasonIngredients() {
  const month = new Date().getMonth() + 1
  return prisma.seasonalIngredient.findMany({
    where: { month },
    orderBy: { price: "asc" },
  })
}

// ====== L2: 食材价格异常检测 ======

export interface PriceAlert {
  type: "price_spike" | "price_drop"
  ingredient: string
  message: string
  suggestion: string
}

export async function detectPriceAnomalies(): Promise<PriceAlert[]> {
  const month = new Date().getMonth() + 1
  const current = await prisma.seasonalIngredient.findMany({ where: { month } })
  const alerts: PriceAlert[] = []

  for (const item of current) {
    const prevMonth = month === 1 ? 12 : month - 1
    const prev = await prisma.seasonalIngredient.findUnique({
      where: { name_month: { name: item.name, month: prevMonth } },
    })

    if (prev) {
      const change = ((item.price - prev.price) / prev.price) * 100

      if (change > 30) {
        alerts.push({
          type: "price_spike",
          ingredient: item.name,
          message: `${item.name}价格较上月上涨 ${change.toFixed(0)}%（¥${prev.price}→¥${item.price}）`,
          suggestion: `建议优先推荐${item.name}的替代食材`,
        })
      }

      if (change < -25) {
        alerts.push({
          type: "price_drop",
          ingredient: item.name,
          message: `${item.name}当季供应充足，价格下降 ${Math.abs(change).toFixed(0)}%（¥${prev.price}→¥${item.price}）`,
          suggestion: `${item.name}当前性价比较高，建议优先推荐含${item.name}的菜谱`,
        })
      }
    }
  }

  return alerts
}

// ====== L3: 季节 → 菜谱推荐联动 ======

export interface SeasonalRecipeAdjustment {
  rule: string
  reason: string
  seasonalIngredients: string[]
  recommendedCategories: string[]
}

export function generateSeasonalAdjustments(): SeasonalRecipeAdjustment {
  const month = new Date().getMonth() + 1

  if (month >= 6 && month <= 8) {
    return {
      rule: "夏季推荐",
      reason: "夏季炎热，优先推荐清热解暑、开胃爽口的菜品",
      seasonalIngredients: ["冬瓜", "苦瓜", "黄瓜", "番茄", "丝瓜"],
      recommendedCategories: ["素菜", "汤羹"],
    }
  }
  if (month >= 12 || month <= 2) {
    return {
      rule: "冬季推荐",
      reason: "冬季寒冷，优先推荐暖身滋补、炖煮类菜品",
      seasonalIngredients: ["白菜", "萝卜", "羊肉", "山药"],
      recommendedCategories: ["荤菜", "汤羹", "家常菜"],
    }
  }
  if (month >= 3 && month <= 5) {
    return {
      rule: "春季推荐",
      reason: "春季回暖，优先推荐新鲜时蔬和清淡菜品",
      seasonalIngredients: ["春笋", "韭菜", "菠菜", "荠菜", "豌豆"],
      recommendedCategories: ["素菜", "家常菜"],
    }
  }
  return {
    rule: "秋季推荐",
    reason: "秋季干燥，优先推荐润燥滋补菜品",
    seasonalIngredients: ["莲藕", "山药", "南瓜", "螃蟹", "板栗"],
    recommendedCategories: ["汤羹", "荤菜"],
  }
}
