"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { ChefHat } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "注册失败，请重试")
      setLoading(false)
      return
    }

    router.push("/login?registered=true")
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 bg-gradient-to-b from-[#FDF2E9] to-[#FEFAF6]">
      <Card className="w-full max-w-md card-paper border-[#E8D5C4]">
        <CardHeader className="text-center pb-2">
          <ChefHat className="mx-auto h-10 w-10 text-[#E07B3C] mb-2" />
          <h1 className="font-heading text-2xl text-[#5C3D2E]">创建账号</h1>
          <p className="text-sm text-[#8B7355]">加入 Smart Recipe，开启智能烹饪之旅</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">昵称</Label>
              <Input
                id="name"
                placeholder="你的昵称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[#E8D5C4]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#E8D5C4]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少6个字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-[#E8D5C4]"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E07B3C] hover:bg-[#D06B2C]"
            >
              {loading ? "注册中..." : "注册"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-[#8B7355]">
            已有账号？{" "}
            <Link href="/login" className="text-[#E07B3C] hover:underline">
              去登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
