import { generateSeasonalData } from "./seasonal-data"

async function main() {
  console.log("🌱 生成当前月份季节食材数据...\n")
  await generateSeasonalData()
  console.log("✅ 季节食材数据生成完成")
}

main()
  .then(() => process.exit(0))
  .catch(console.error)
