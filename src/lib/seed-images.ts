import "dotenv/config"
import { prisma } from "./prisma"

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
if (!ACCESS_KEY) {
  console.error("❌ 请先在 .env 中设置 UNSPLASH_ACCESS_KEY")
  process.exit(1)
}

// 每道菜的搜索关键词（中文 + 英文备选）
const recipeQueries: Record<string, string[]> = {
  "麻婆豆腐": ["麻婆豆腐 mapo tofu", "mapo tofu chinese"],
  "回锅肉": ["回锅肉 twice cooked pork", "twice cooked pork sichuan"],
  "宫保鸡丁": ["宫保鸡丁 kung pao chicken", "kung pao chicken"],
  "番茄炒蛋": ["番茄炒蛋 scrambled egg tomato", "tomato egg stir fry chinese"],
  "红烧肉": ["红烧肉 red braised pork", "red braised pork belly chinese"],
  "糖醋排骨": ["糖醋排骨 sweet sour ribs", "sweet and sour spare ribs chinese"],
  "清蒸鲈鱼": ["清蒸鲈鱼 steamed fish", "steamed sea bass chinese"],
  "红烧牛腩": ["红烧牛腩 braised beef brisket", "braised beef brisket chinese"],
  "蒜蓉大虾": ["蒜蓉大虾 garlic shrimp", "garlic shrimp chinese"],
  "葱爆羊肉": ["葱爆羊肉 scallion lamb stir fry", "stir fried lamb with scallion"],
  "可乐鸡翅": ["可乐鸡翅 cola chicken wings", "cola chicken wings chinese"],
  "蒜蓉油麦菜": ["蒜蓉油麦菜 garlic lettuce", "stir fried lettuce chinese"],
  "干煸四季豆": ["干煸四季豆 dry fried green beans", "dry fried green beans sichuan"],
  "醋溜土豆丝": ["醋溜土豆丝 vinegar potato", "stir fried shredded potato chinese"],
  "蚝油生菜": ["蚝油生菜 oyster sauce lettuce", "oyster sauce lettuce chinese"],
  "紫菜蛋花汤": ["紫菜蛋花汤 seaweed egg soup", "seaweed egg drop soup chinese"],
  "酸辣汤": ["酸辣汤 hot sour soup", "hot and sour soup chinese"],
  "排骨莲藕汤": ["排骨莲藕汤 lotus root soup", "lotus root pork rib soup chinese"],
  "蛋炒饭": ["蛋炒饭 egg fried rice", "egg fried rice chinese"],
  "葱油拌面": ["葱油拌面 scallion oil noodles", "scallion oil noodles shanghai"],
}

interface UnsplashResult {
  id: string
  urls: { regular: string; small: string; thumb: string }
  alt_description: string | null
  links: { html: string }
  user: { name: string; links: { html: string } }
}

async function searchUnsplash(query: string): Promise<UnsplashResult | null> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  })
  if (!res.ok) {
    console.warn(`  ⚠ Unsplash API ${res.status} for query: ${query}`)
    return null
  }
  const data = await res.json()
  if (!data.results?.length) return null
  const r = data.results[0]
  return {
    id: r.id,
    urls: { regular: r.urls.regular, small: r.urls.small, thumb: r.urls.thumb },
    alt_description: r.alt_description,
    links: { html: r.links.html },
    user: { name: r.user.name, links: { html: r.user.links.html } },
  }
}

async function main() {
  console.log("🔍 开始从 Unsplash 搜索菜谱图片...\n")
  const recipes = await prisma.recipe.findMany()

  let found = 0
  let skipped = 0

  for (const recipe of recipes) {
    const queries = recipeQueries[recipe.name] || [recipe.name]
    let result: UnsplashResult | null = null

    for (const q of queries) {
      result = await searchUnsplash(q)
      if (result) break
    }

    if (result) {
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { imageUrl: result.urls.regular },
      })
      console.log(`  ✓ ${recipe.name} → ${result.user.name} (Unsplash)`)
      found++
      // Unsplash 速率限制：50 req/hour on demo, be gentle
      await new Promise((r) => setTimeout(r, 200))
    } else if (recipe.imageUrl) {
      skipped++
      console.log(`  - ${recipe.name}: 已有图片，跳过`)
    } else {
      console.log(`  ✗ ${recipe.name}: 未找到合适图片`)
    }
  }

  console.log(`\n✅ 完成！共 ${recipes.length} 道菜: ${found} 张新图, ${skipped} 张已有, ${recipes.length - found - skipped} 张未找到`)
  await prisma.$disconnect()
}

main()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
