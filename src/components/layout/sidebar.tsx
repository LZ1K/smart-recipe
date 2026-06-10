import Link from "next/link"
import { ChefHat, Heart, MessageCircle, User } from "lucide-react"

export function Sidebar() {
  const items = [
    { icon: ChefHat, label: "菜谱库", href: "/recipes" },
    { icon: MessageCircle, label: "智能对话", href: "/chat" },
    { icon: Heart, label: "收藏夹", href: "/favorites" },
    { icon: User, label: "个人中心", href: "/profile" },
  ]

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-16 border-r border-[#E8D5C4] bg-[#FEFAF6] flex flex-col items-center py-4 gap-1 z-40">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-1 p-2 rounded-lg text-[#8B7355] hover:text-[#E07B3C] hover:bg-[#FDF2E9] transition-colors w-14"
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px]">{item.label}</span>
        </Link>
      ))}
    </aside>
  )
}
