"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatPanelProps {
  messages: Message[]
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatPanel({ messages, onSend, isLoading }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-[#8B7355]">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="font-heading text-xl mb-2">想吃点什么呢？</h3>
            <p className="text-sm">告诉我你的口味和食材，我帮你推荐最适合的菜谱</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {["番茄炒蛋怎么做？", "我不吃辣有什么推荐？", "冰箱里有豆腐和肉末", "红烧肉的热量是多少？"].map(
                (hint) => (
                  <button
                    key={hint}
                    onClick={() => onSend(hint)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#E8D5C4] text-[#8B7355] hover:bg-[#FDF2E9] hover:text-[#E07B3C] transition-colors"
                  >
                    {hint}
                  </button>
                )
              )}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#E07B3C] text-white rounded-br-md"
                  : "bg-[#FDF2E9] text-[#3D2C1E] rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#FDF2E9] rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-[#E07B3C]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[#E8D5C4] p-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的问题，比如 '番茄炒蛋怎么做？'"
          className="border-[#E8D5C4] focus-visible:ring-[#E07B3C]"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading} className="bg-[#E07B3C] hover:bg-[#D06B2C]">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
