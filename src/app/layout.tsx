import type { Metadata } from "next"
import { Noto_Sans_SC, ZCOOL_KuaiLe } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/layout/header"
import "./globals.css"

const notoSans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const zcoolKuaiLe = ZCOOL_KuaiLe({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Smart Recipe - 智能菜谱助手",
  description: "一个懂你口味的智能菜谱助手，帮你发现、收藏、定制属于你的美味。",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${notoSans.variable} ${zcoolKuaiLe.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FEFAF6] text-[#3D2C1E]">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </SessionProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
