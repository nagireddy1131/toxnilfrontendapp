"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Mail, Phone, MessageCircle, BookOpen, Truck, RefreshCw, HelpCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { faqData } from "@/lib/data"

const categoryIcons: Record<string, any> = {
  "Products & Ingredients": BookOpen,
  "Orders & Shipping": Truck,
  "Returns & Refunds": RefreshCw,
  "Subscriptions & Loyalty": HelpCircle,
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter(
      (category) =>
        (selectedCategory === null || category.category === selectedCategory) && category.questions.length > 0,
    )

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a4d3e] to-[#2d6a5a] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">How Can We Help?</h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our products, orders, and more
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-white text-foreground rounded-full border-0"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-[#1a4d3e] hover:bg-[#2d6a5a]" : ""}
          >
            All Topics
          </Button>
          {faqData.map((category) => {
            const Icon = categoryIcons[category.category] || HelpCircle
            return (
              <Button
                key={category.category}
                variant={selectedCategory === category.category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.category)}
                className={selectedCategory === category.category ? "bg-[#1a4d3e] hover:bg-[#2d6a5a]" : ""}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.category}
              </Button>
            )
          })}
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFAQ.map((category) => {
            const Icon = categoryIcons[category.category] || HelpCircle
            return (
              <Card key={category.category} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-[#1a4d3e]/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#1a4d3e]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a4d3e] font-playfair">{category.category}</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, idx) => (
                    <AccordionItem key={idx} value={`${category.category}-${idx}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline text-left font-medium">{item.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            )
          })}
        </div>

        {/* Contact Support */}
        <Card className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-emerald-50 to-[#F5F3F0]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1a4d3e] font-playfair mb-2">Still Need Help?</h2>
            <p className="text-muted-foreground">Our support team is here to assist you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-[#1a4d3e] text-white flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Get a response within 24 hours</p>
              <a href="mailto:support@toxnil.com" className="text-[#1a4d3e] font-semibold hover:underline">
                support@toxnil.com
              </a>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-[#1a4d3e] text-white flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Mon-Fri, 9am-6pm EST</p>
              <a href="tel:+18001234567" className="text-[#1a4d3e] font-semibold hover:underline">
                1-800-123-4567
              </a>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-[#1a4d3e] text-white flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Chat with our AI assistant</p>
              <Button className="bg-[#1a4d3e] hover:bg-[#2d6a5a]">Start Chat</Button>
            </div>
          </div>
        </Card>

        {/* How-To Guides */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-[#1a4d3e] font-playfair mb-6 text-center">How-To Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "How to Track Your Order", desc: "Step-by-step guide to tracking your shipment" },
              { title: "Setting Up Subscriptions", desc: "Learn how to save with auto-delivery" },
              { title: "Maximizing Your Supplements", desc: "Tips for optimal absorption and results" },
              { title: "Understanding Nanotechnology", desc: "Learn about our advanced delivery system" },
            ].map((guide, idx) => (
              <Card key={idx} className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-[#1a4d3e] transition-colors">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground">{guide.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
