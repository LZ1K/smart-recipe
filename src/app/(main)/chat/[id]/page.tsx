import { ChatClient } from "@/components/chat-client"

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ChatClient conversationId={id} />
}
