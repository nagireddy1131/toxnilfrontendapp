"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Minimize2, ChevronLeft, Info, Truck, Package, Phone } from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type Category = "main" | "delivery" | "products" | "support"

const botResponses: Record<string, string> = {
  // Delivery & Shipping
  "track my order":
    "To track your order, please go to your **Account Dashboard** > **Order History**. You'll find real-time tracking information there.\n\nNeed further assistance? Contact our support team.",
  "shipping info & costs":
    "**Shipping Information:**\n\n• **Free Shipping** on orders over ₹1500\n• **Standard** (3-5 business days): ₹99\n• **Express** (1-2 business days): ₹199\n\nAll orders include tracking and are shipped in eco-friendly packaging!",
  "delivery issues / delay":
    "I apologize for the inconvenience! If your order is delayed or you have delivery issues, our support team can help resolve this immediately.\n\nPlease call our delivery helpline at **+91 98765-43210** or email us at **support@toxnil.com** with your order ID.",

  // Products & Tech
  "product recommendations":
    "I'd be happy to help you find the right supplement! What are your main health goals? Options include:\n\n• **Joint Health** - Try Nano Curcumin Plus\n• **Heart Health** - Bio-Enhanced Omega-3\n• **Daily Wellness** - Advanced Multivitamin\n• **Better Sleep** - Magnesium Complex\n\nBrowse our shop to see the full collection!",
  "what is nano technology?":
    "Great question! **Nano-enhanced technology** reduces the size of active ingredients (like Curcumin) to a nanometer scale. This allows the nutrients to bypass digestive degradation and enter your bloodstream directly.\n\n**Result:** Up to 10x better absorption compared to regular supplements, meaning faster and more effective results!",
  "dosage questions":
    "Each product has specific dosage instructions on the label. General guidelines:\n\n• **Most supplements**: 1-2 capsules daily\n• **Take with meals** for better absorption\n• **Magnesium**: Best taken before bedtime\n• **Probiotics**: Take on an empty stomach",

  // Support
  "return policy":
    "We offer a **30-Day Satisfaction Guarantee**!\n\n• Return any product within 30 days\n• Full refund, no questions asked\n• Even opened products can be returned\n• Free return shipping provided\n\nContact support@toxnil.com to initiate a return.",
  "contact support":
    "We're here to help! You can reach us via:\n\n📧 **Email:** support@toxnil.com\n📞 **Phone:** +91 98765-43210 (Mon-Sat, 9 AM - 6 PM)\n🏢 **Address:** Toxnil Wellness HQ, Health Park, Bangalore, 560001",
  
  default:
    "I'm sorry, I didn't quite catch that. You can choose one of the topics from the menu below, or ask me directly about our products, delivery, or technology!",
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "👋 Hi! I'm your TOXNIL wellness assistant. What can I help you with today? Choose a category below or type your question.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category>("main")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text: string = input, skipUserMessage: boolean = false) => {
    if (!text.trim()) return

    if (!skipUserMessage) {
      const userMessage: Message = {
        id: messages.length + 1,
        role: "user",
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
    }
    
    setInput("")
    setIsTyping(true)

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500))

    const lowerText = text.toLowerCase()
    let response = botResponses.default

    for (const [key, value] of Object.entries(botResponses)) {
      if (lowerText.includes(key)) {
        response = value
        break
      }
    }

    // Specific keyword matching for typed text
    if (!Object.keys(botResponses).some(key => lowerText.includes(key))) {
      if (lowerText.includes("curcumin") || lowerText.includes("joint")) {
        response = "**Nano Curcumin Plus** is our best-seller for joint health! It features:\n\n• 10x better absorption\n• Powerful anti-inflammatory properties\n• ₹1499"
      } else if (lowerText.includes("omega") || lowerText.includes("heart")) {
        response = "For heart health, I recommend **Bio-Enhanced Omega-3**:\n\n• Nano-emulsified for superior absorption\n• Supports brain & cardiovascular health\n• ₹1299"
      } else if (lowerText.includes("sleep") || lowerText.includes("stress")) {
        response = "For better sleep and relaxation, try **Magnesium Complex**:\n\n• Promotes muscle relaxation\n• Reduces stress\n• Take 2 capsules before bedtime"
      } else if (lowerText.includes("contact") || lowerText.includes("phone") || lowerText.includes("email") || lowerText.includes("call")) {
        response = botResponses["contact support"]
      } else if (lowerText.includes("delivery") || lowerText.includes("delay") || lowerText.includes("where is my order")) {
        response = botResponses["delivery issues / delay"]
      } else if (lowerText.includes("nano") || lowerText.includes("technology")) {
        response = botResponses["what is nano technology?"]
      } else if (lowerText.includes("return") || lowerText.includes("refund")) {
        response = botResponses["return policy"]
      }
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

  const renderQuickReplies = () => {
    if (currentCategory === "main") {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentCategory("delivery")} className="flex items-center gap-2 justify-start h-10 border-[#1a4d3e]/30 text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white">
            <Truck className="h-4 w-4" /> Delivery
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentCategory("products")} className="flex items-center gap-2 justify-start h-10 border-[#1a4d3e]/30 text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white">
            <Package className="h-4 w-4" /> Products
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentCategory("support")} className="flex items-center gap-2 justify-start h-10 border-[#1a4d3e]/30 text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white">
            <Phone className="h-4 w-4" /> Support
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSend("What is Nano Technology?")} className="flex items-center gap-2 justify-start h-10 border-[#1a4d3e]/30 text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white">
            <Info className="h-4 w-4" /> Nano Tech
          </Button>
        </div>
      )
    }

    const categoryQuestions = {
      delivery: ["Track my order", "Shipping info & costs", "Delivery issues / Delay"],
      products: ["Product recommendations", "Dosage questions", "What is Nano Technology?"],
      support: ["Return policy", "Contact Support", "Delivery issues / Delay"]
    }

    return (
      <div className="space-y-2 flex flex-col">
        <Button variant="ghost" size="sm" onClick={() => setCurrentCategory("main")} className="self-start text-xs text-muted-foreground hover:text-[#1a4d3e] p-0 h-auto mb-1">
          <ChevronLeft className="h-3 w-3 mr-1" /> Back to menu
        </Button>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categoryQuestions[currentCategory as keyof typeof categoryQuestions].map((q) => (
            <Button
              key={q}
              variant="outline"
              size="sm"
              onClick={() => handleSend(q)}
              className="whitespace-nowrap text-xs border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white flex-shrink-0"
            >
              {q}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#1a4d3e] hover:bg-[#2d6a5a] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-[100]"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute top-0 right-0 h-3 w-3 bg-[#D4AF37] rounded-full animate-pulse" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] shadow-2xl z-[100] overflow-hidden transition-all duration-300 flex flex-col ${isMinimized ? "h-14" : "h-[550px] max-h-[80vh]"}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a4d3e] to-[#2d6a5a] text-white p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">TOXNIL Assistant</h3>
            <p className="text-[10px] md:text-xs text-white/80">Online • Typically replies instantly</p>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F3F0]">
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
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-[#1a4d3e] text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                  }`}
                >
                  {/* Process bold text in responses */}
                  <p className="whitespace-pre-line leading-relaxed">
                    {message.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className={message.role === "user" ? "text-white" : "text-[#1a4d3e]"}>{part}</strong> : part)}
                  </p>
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
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Menu */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] flex-shrink-0">
            {renderQuickReplies()}
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-50 border-t flex-shrink-0">
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
                className="flex-1 bg-white border-gray-200 focus-visible:ring-[#1a4d3e]"
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
