import Link from "next/link"
import { auth } from "@/lib/auth"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, MessageCircle, Heart, Brain, Sparkles, CookingPot } from "lucide-react"

export default async function HomePage() {
  const session = await auth()
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF2E9] via-[#FEFAF6] to-[#FEFAF6] pb-16 pt-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8D5C4] bg-white px-4 py-1.5 text-sm text-[#8B7355]">
            <Sparkles className="h-4 w-4 text-[#E07B3C]" />
            AI 驱动 | 懂你口味 | 会学习的菜谱助手
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#5C3D2E] mb-6">
            每一顿饭
            <br />
            都值得被
            <span className="text-[#E07B3C]">用心对待</span>
          </h1>
          <p className="mx-auto max-w-xl text-[#8B7355] text-lg mb-10 leading-relaxed">
            Smart Recipe 不只是菜谱库。它记住你爱吃什么、忌口什么，
            懂得食材间的微妙关联，用 AI 为你推荐最对胃口的每一餐。
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {session ? (
              <>
                <Link href="/chat" className={buttonVariants({ size: "lg", className: "bg-[#E07B3C] hover:bg-[#D06B2C] text-base px-8" })}>
                  开始对话
                </Link>
                <Link href="/recipes" className={buttonVariants({ variant: "outline", size: "lg", className: "border-[#E8D5C4] text-base px-8" })}>
                  浏览菜谱库
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" className={buttonVariants({ size: "lg", className: "bg-[#E07B3C] hover:bg-[#D06B2C] text-base px-8" })}>
                  免费开始使用
                </Link>
                <Link href="/recipes" className={buttonVariants({ variant: "outline", size: "lg", className: "border-[#E8D5C4] text-base px-8" })}>
                  浏览菜谱库
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl sm:text-3xl text-center text-[#5C3D2E] mb-12">
            不只是菜谱，更是你的
            <span className="text-[#E07B3C]">私人烹饪顾问</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="card-paper border-[#E8D5C4] text-center pt-8">
                <CardContent>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDF2E9]">
                    <f.icon className="h-6 w-6 text-[#E07B3C]" />
                  </div>
                  <h3 className="font-heading text-lg text-[#5C3D2E] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#8B7355] leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20 px-4 bg-[#FDF2E9]/50">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-heading text-2xl sm:text-3xl text-[#5C3D2E] mb-4">20道经典中式菜谱</h2>
          <p className="text-[#8B7355] mb-10">家常菜、荤菜、素菜、汤羹、主食，五大分类应有尽有</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["家常菜", "荤菜", "素菜", "汤羹", "主食"].map((cat) => (
              <Link
                key={cat}
                href="/recipes"
                className="inline-flex items-center gap-2 rounded-full border border-[#E8D5C4] bg-white px-5 py-2.5 text-[#5C3D2E] hover:border-[#E07B3C] hover:text-[#E07B3C] transition-colors"
              >
                <CookingPot className="h-4 w-4" />
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: MessageCircle,
    title: "智能对话",
    desc: "像跟朋友聊天一样，告诉 AI 你想吃什么、有什么食材，它帮你出谋划策。",
  },
  {
    icon: Brain,
    title: "长期记忆",
    desc: "你说过不吃辣、爱吃番茄，AI 一直记得。下次推荐自动避开辣菜。",
  },
  {
    icon: Heart,
    title: "收藏定制",
    desc: "收藏喜欢的菜谱，个性化修改调料和步骤，打造专属版本。",
  },
  {
    icon: ChefHat,
    title: "食材关联",
    desc: "不吃辣椒 ≠ 不吃青椒，AI 会主动追问，不武断替你下结论。",
  },
]
