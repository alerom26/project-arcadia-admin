"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Users, Megaphone, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Member } from "@/lib/auth"

interface ChatMessage {
  id: string
  channel_id: string
  sender_id: string
  message: string
  sent_at: string
  sender_name?: string
}

interface ChatChannel {
  id: string
  name: string
  description: string
  type: "general" | "announcement" | "group"
  created_by: string
  is_active: boolean
}

interface ChatSystemProps {
  user: Member
}

export function ChatSystem({ user }: ChatSystemProps) {
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentChannel, setCurrentChannel] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChannels()
  }, [])

  useEffect(() => {
    if (currentChannel) {
      loadMessages(currentChannel)
      subscribeToMessages(currentChannel)
    }
  }, [currentChannel])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChannels = async () => {
    try {
      const { data, error } = await supabase.from("chat_channels").select("*").eq("is_active", true).order("created_at")

      if (error) throw error

      setChannels(data || [])
      if (data && data.length > 0) {
        setCurrentChannel(data[0].id)
      }
    } catch (error) {
      console.error("Error loading channels:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (channelId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("channel_id", channelId)
        .order("sent_at", { ascending: true })
        .limit(100)

      if (error) throw error

      // Add sender names to messages
      const messagesWithNames = (data || []).map((msg) => ({
        ...msg,
        sender_name: getSenderName(msg.sender_id),
      }))

      setMessages(messagesWithNames)
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const subscribeToMessages = (channelId: string) => {
    const subscription = supabase
      .channel(`chat-${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          const newMessage = {
            ...payload.new,
            sender_name: getSenderName(payload.new.sender_id),
          } as ChatMessage
          setMessages((prev) => [...prev, newMessage])
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const getSenderName = (senderId: string): string => {
    // In a real app, you'd fetch this from your members database
    const senderMap: Record<string, string> = {
      jasper_shaw: "Jasper Shaw",
      alex_romanov: "Alex Romanov",
      rupert_mcvey: "Rupert McVey",
      bowen_jiang: "Bowen Jiang",
      william_lin: "William Lin",
      harry_lee: "Harry Lee",
      suri_chun: "Suri Chun",
      rafael_fok: "Rafael Fok",
    }
    return senderMap[senderId] || senderId
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentChannel) return

    const currentChannelData = channels.find((c) => c.id === currentChannel)

    // Check if user can send messages to this channel
    if (currentChannelData?.type === "announcement" && !user.isAdmin) {
      return // Only admins can post in announcement channels
    }

    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          channel_id: currentChannel,
          sender_id: user.username,
          message: newMessage.trim(),
        },
      ])

      if (error) throw error

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="h-4 w-4" />
      case "group":
        return <Users className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const canSendMessage = (channel: ChatChannel) => {
    if (channel.type === "announcement") {
      return user.isAdmin
    }
    return true
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  const currentChannelData = channels.find((c) => c.id === currentChannel)

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex-1 flex">
        {/* Channel List */}
        <div className="w-64 border-r bg-gray-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Channels
            </h3>
          </div>
          <div className="p-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setCurrentChannel(channel.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  currentChannel === channel.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {getChannelIcon(channel.type)}
                  <span className="font-medium">{channel.name}</span>
                </div>
                {channel.type === "announcement" && (
                  <Badge className="mt-1 text-xs bg-orange-100 text-orange-700">Admin Only</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center">
                  {currentChannelData && getChannelIcon(currentChannelData.type)}
                  <span className="ml-2">{currentChannelData?.name}</span>
                </h3>
                <p className="text-sm text-gray-600">{currentChannelData?.description}</p>
              </div>
              {user.isAdmin && (
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Channel
                </Button>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {message.sender_name?.charAt(0) || message.sender_id.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{message.sender_name || message.sender_id}</span>
                      <span className="text-xs text-gray-500">{formatTime(message.sent_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{message.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            {currentChannelData && canSendMessage(currentChannelData) ? (
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${currentChannelData.name}...`}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">Only administrators can post in this channel</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
