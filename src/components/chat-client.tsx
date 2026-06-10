"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChatPanel } from "@/components/ui/chat-panel"
import { PreferenceTags } from "@/components/ui/preference-tags"
import { WeatherCard } from "@/components/ui/weather-card"
import { SeasonalCard } from "@/components/ui/seasonal-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { History, Plus, X } from "lucide-react"

interface Message { role: "user" | "assistant"; content: string }
interface Preference { id: string; type: "TASTE" | "FAVORITE" | "AVOIDANCE" | "ALLERGY"; value: string }
interface ConversationItem { id: string; title: string; updatedAt: string }

interface ChatClientProps {
  conversationId?: string
}

export function ChatClient({ conversationId: initialId }: ChatClientProps) {
  const router = useRouter()
  const [conversationId, setConversationId] = useState<string | null>(initialId ?? null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<Preference[]>([])
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const loadingRef = useRef(false)
  const loadedIdRef = useRef<string | null>(null)
  const sseConversationRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Abort ongoing SSE stream on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  // Load conversations list and preferences on mount
  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then(setConversations)
      .catch(() => {})

    fetch("/api/preferences")
      .then((r) => r.json())
      .then(setPreferences)
      .catch(() => {})
  }, [])

  // Load messages when conversationId changes (initial load or switch)
  useEffect(() => {
    const id = conversationId
    if (!id || id === loadedIdRef.current) return
    // Skip DB fetch if this conversation was just created via SSE (messages already in state)
    if (id === sseConversationRef.current) {
      sseConversationRef.current = null
      loadedIdRef.current = id
      return
    }
    loadedIdRef.current = id
    fetch(`/api/conversations/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found")
        return r.json()
      })
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => {
        // Conversation not found, reset
        setConversationId(null)
        setMessages([])
        router.replace("/chat")
      })
  }, [conversationId, router])

  // Sync initialId → conversationId on first mount
  useEffect(() => {
    if (initialId && conversationId !== initialId) {
      setConversationId(initialId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId])

  const handleSend = useCallback(async (message: string) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setIsLoading(true)

    // Cancel any previous in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const userMsg: Message = { role: "user", content: message }
    setMessages((prev) => [...prev, userMsg])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId }),
        signal: controller.signal,
      })

      if (!res.ok) throw new Error("Chat failed")

      // SSE
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMsg: Message = { role: "assistant", content: "" }

      if (reader) {
        while (true) {
          if (controller.signal.aborted) break
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantMsg.content += parsed.content
                  setMessages((prev) => {
                    const copy = [...prev]
                    const last = copy[copy.length - 1]
                    if (last?.role === "assistant") {
                      copy[copy.length - 1] = assistantMsg
                    } else {
                      copy.push(assistantMsg)
                    }
                    return [...copy]
                  })
                }
                if (parsed.conversationId) {
                  sseConversationRef.current = parsed.conversationId
                  setConversationId(parsed.conversationId)
                }
                if (parsed.preferences) {
                  setPreferences(parsed.preferences)
                }
              } catch {}
            }
          }
        }
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return
      console.error("Chat error:", err)
      toast.error("消息发送失败，请稍后重试")
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
      }
      loadingRef.current = false
      setIsLoading(false)
    }

    // Refresh conversations list and preferences from DB
    fetch("/api/conversations")
      .then((r) => r.json())
      .then(setConversations)
      .catch(() => {})

    fetch("/api/preferences")
      .then((r) => r.json())
      .then(setPreferences)
      .catch(() => {})
  }, [conversationId])

  const handleNewChat = useCallback(() => {
    setConversationId(null)
    setMessages([])
    router.replace("/chat")
  }, [router])

  const handleSelectConversation = useCallback((id: string) => {
    loadedIdRef.current = null
    setConversationId(id)
    router.push(`/chat/${id}`)
  }, [router])

  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" })
    } catch {
      // Proceed with local removal even if API fails
    }
    setConversations((prev) => prev.filter((c) => c.id !== id))
    // If deleted conversation is the current one, reset to new chat
    if (conversationId === id) {
      setConversationId(null)
      setMessages([])
      router.replace("/chat")
    }
  }, [conversationId, router])

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Side panel */}
      <div className="hidden md:flex md:w-72 border-r border-[#E8D5C4] bg-[#FEFAF6] flex-col overflow-y-auto slim-scrollbar">
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full bg-[#E07B3C] hover:bg-[#D06B2C] gap-2"
          >
            <Plus className="h-4 w-4" /> 新对话
          </Button>
        </div>

        <div className="p-3 border-t border-[#E8D5C4]">
          <WeatherCard />
        </div>

        <div className="p-3 border-t border-[#E8D5C4]">
          <SeasonalCard />
        </div>

        <div className="p-4 border-t border-[#E8D5C4]">
          <h3 className="text-sm font-medium text-[#5C3D2E] mb-2">你的偏好</h3>
          <PreferenceTags
            preferences={preferences}
            onRemove={async (id) => {
              await fetch(`/api/preferences/${id}`, { method: "DELETE" })
              setPreferences((prev) => prev.filter((p) => p.id !== id))
            }}
          />
        </div>

        <div className="p-4 border-t border-[#E8D5C4]">
          <h3 className="text-sm font-medium text-[#5C3D2E] mb-2">历史对话</h3>
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center rounded-lg transition-colors ${
                conversationId === c.id
                  ? "bg-[#FDF2E9]"
                  : "hover:bg-[#FDF2E9]"
              }`}
            >
              <button
                onClick={() => handleSelectConversation(c.id)}
                className={`flex-1 text-left text-sm px-3 py-2 truncate ${
                  conversationId === c.id
                    ? "text-[#E07B3C] font-medium"
                    : "text-[#8B7355] group-hover:text-[#E07B3C]"
                }`}
              >
                {c.title || "新对话"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteConversation(c.id); }}
                className="shrink-0 px-2 py-2 text-[#8B7355] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                title="删除对话"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden absolute top-16 left-2 z-40">
        <Sheet>
          <SheetTrigger className={buttonVariants({ variant: "outline", size: "icon", className: "border-[#E8D5C4]" })}>
            <History className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#FEFAF6]">
            <div className="mt-4 space-y-4">
              <Button
                onClick={handleNewChat}
                className="w-full bg-[#E07B3C] hover:bg-[#D06B2C] gap-2"
              >
                <Plus className="h-4 w-4" /> 新对话
              </Button>
              <h3 className="text-sm font-medium text-[#5C3D2E]">历史对话</h3>
              {conversations.map((c) => (
                <div
                  key={c.id}
                  className={`group flex items-center rounded-lg ${
                    conversationId === c.id ? "bg-[#FDF2E9]" : ""
                  }`}
                >
                  <button
                    onClick={() => handleSelectConversation(c.id)}
                    className={`flex-1 text-left text-sm px-3 py-2 ${
                      conversationId === c.id
                        ? "text-[#E07B3C] font-medium"
                        : "text-[#8B7355]"
                    }`}
                  >
                    {c.title || "新对话"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteConversation(c.id); }}
                    className="shrink-0 px-2 py-2 text-[#8B7355] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="删除对话"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Chat area */}
      <div className="flex-1">
        <ChatPanel messages={messages} onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  )
}
