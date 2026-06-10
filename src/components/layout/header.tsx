"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChefHat } from "lucide-react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8D5C4] bg-[#FEFAF6]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <ChefHat className="h-6 w-6 text-[#E07B3C]" />
          <span className="font-heading text-[#E07B3C]">Smart Recipe</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/recipes" className="hover:text-[#E07B3C] transition-colors">
            菜谱库
          </Link>
          {session && (
            <>
              <Link href="/chat" className="hover:text-[#E07B3C] transition-colors">
                智能对话
              </Link>
              <Link href="/favorites" className="hover:text-[#E07B3C] transition-colors">
                收藏夹
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-full border-2 border-[#E8D5C4] overflow-hidden">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#E07B3C] text-white text-xs">
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">个人中心</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                登录
              </Link>
              <Link href="/register" className={buttonVariants({ className: "bg-[#E07B3C] hover:bg-[#D06B2C]" })}>
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
