import { prisma } from "./prisma"

// 插入上月对比数据，用于触发价格预警
async function main() {
  console.log("插入价格预警测试数据...")

  // 4月价格（高于5月，触发 price_drop / price_spike）
  await prisma.seasonalIngredient.upsert({
    where: { name_month: { name: "黄瓜", month: 4 } },
    update: { price: 5, season: "春季" },
    create: { name: "黄瓜", month: 4, price: 5, season: "春季" },
  })
  await prisma.seasonalIngredient.upsert({
    where: { name_month: { name: "番茄", month: 4 } },
    update: { price: 10, season: "春季" },
    create: { name: "番茄", month: 4, price: 10, season: "春季" },
  })
  await prisma.seasonalIngredient.upsert({
    where: { name_month: { name: "豇豆", month: 4 } },
    update: { price: 3, season: "春季" },
    create: { name: "豇豆", month: 4, price: 3, season: "春季" },
  })

  console.log("  ✓ 4月 黄瓜 ¥5 / 番茄 ¥10 / 豇豆 ¥3")
  console.log("✅ 测试数据就绪")
  await prisma.$disconnect()
}

main()
