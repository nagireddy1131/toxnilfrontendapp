"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickReplies = ["Product recommendations", "Track my order", "Shipping info", "Return policy", "Dosage questions"]

const botResponses: Record<string, string> = {
  "product recommendations":
    "I'd be happy to help you find the right supplement! What are your main health goals? Options include:\n\n• **Joint Health** - Try Nano Curcumin Plus\n• **Heart Health** - Bio-Enhanced Omega-3\n• **Daily Wellness** - Advanced Multivitamin\n• **Better Sleep** - Magnesium Complex\n\nTell me more about what you're looking for!",
  "track my order":
    "To track your order, please go to your **Account Dashboard** > **Order History**. You'll find real-time tracking information there.\n\nAlternatively, check the tracking email we sent when your order shipped. Need help finding it? Email us at support@toxnil.com with your order number.",
  "shipping info":
    "**Shipping Information:**\n\n• **Free Shipping** on orders over $50\n• **Standard** (3-5 business days): $5.99\n• **Express** (1-2 business days): $12.99\n• **International**: 7-14 business days\n\nAll orders include tracking and are shipped in eco-friendly packaging!",
  "return policy":
    "We offer a **30-Day Satisfaction Guarantee**!\n\n• Return any product within 30 days\n• Full refund, no questions asked\n• Even opened products can be returned\n• Free return shipping provided\n\nContact support@toxnil.com to initiate a return.",
  "dosage questions":
    "Each product has specific dosage instructions on the label. General guidelines:\n\n• **Most supplements**: 1-2 capsules daily\n• **Take with meals** for better absorption\n• **Magnesium**: Best taken before bedtime\n• **Probiotics**: Take on empty stomach\n\nWhich specific product would you like dosage info for?",
  default:
    "Thanks for reaching out! I'm here to help with:\n\n• Product recommendations\n• Order tracking\n• Shipping & returns\n• Dosage & ingredients\n• General questions\n\nHow can I assist you today?",
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "👋 Hi! I'm your TOXNIL wellness assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const lowerText = text.toLowerCase()
    let response = botResponses.default

    for (const [key, value] of Object.entries(botResponses)) {
      if (lowerText.includes(key)) {
        response = value
        break
      }
    }

    // Check for specific keywords
    if (lowerText.includes("curcumin") || lowerText.includes("joint")) {
      response =
        "**Nano Curcumin Plus** is our best-seller for joint health! It features:\n\n• 10x better absorption than standard curcumin\n• Powerful anti-inflammatory properties\n• 4.8★ rating from 1,074+ reviews\n• $49.99 (29% off!)\n\nWould you like me to add it to your cart?"
    } else if (lowerText.includes("omega") || lowerText.includes("heart")) {
      response =
        "For heart health, I recommend **Bio-Enhanced Omega-3**:\n\n• Nano-emulsified for superior absorption\n• No fishy aftertaste!\n• Supports brain & cardiovascular health\n• 4.9★ rating - our highest rated product!\n\nIt's currently on sale for $39.99 (27% off)!"
    } else if (lowerText.includes("sleep") || lowerText.includes("stress") || lowerText.includes("relax")) {
      response =
        "For better sleep and relaxation, try **Magnesium Complex**:\n\n• Multiple forms for optimal absorption\n• Promotes muscle relaxation\n• Reduces stress and anxiety\n• Take 2 capsules before bedtime\n\nIt's our top-rated sleep supplement with 4.9★!"
    }

    const assistantMessage: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#1a4d3e] hover:bg-[#2d6a5a] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
        {/* Notification dot */}
        <span className="absolute top-0 right-0 h-3 w-3 bg-[#D4AF37] rounded-full animate-pulse" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 shadow-2xl z-50 overflow-hidden transition-all duration-300 ${isMinimized ? "h-14" : "h-[500px]"}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a4d3e] to-[#2d6a5a] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">TOXNIL Assistant</h3>
            <p className="text-xs text-white/80">Online • Typically replies instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[340px] bg-[#F5F3F0]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-[#1a4d3e] flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-[#1a4d3e] text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-[#1a4d3e] flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-white border-t overflow-x-auto">
            <div className="flex gap-2">
              {quickReplies.map((reply) => (
                <Button
                  key={reply}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(reply)}
                  className="whitespace-nowrap text-xs border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white flex-shrink-0"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" className="bg-[#1a4d3e] hover:bg-[#2d6a5a]" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}
