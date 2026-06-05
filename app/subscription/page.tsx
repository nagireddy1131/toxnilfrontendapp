"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Crown, Check, Gift, Truck, Percent, Star, Zap, Heart, Shield, Clock, ChevronRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

const subscriptionPlans = [
  {
    name: "Essential",
    price: 29.99,
    frequency: "month",
    description: "Perfect for daily wellness essentials",
    features: ["Choose 1 supplement", "15% off retail price", "Free standard shipping", "Pause or cancel anytime"],
    popular: false,
  },
  {
    name: "Wellness Plus",
    price: 59.99,
    frequency: "month",
    description: "Most popular for comprehensive health",
    features: [
      "Choose 2 supplements",
      "20% off retail price",
      "Free express shipping",
      "Double loyalty points",
      "Priority customer support",
      "Free wellness consultation",
    ],
    popular: true,
  },
  {
    name: "Family Pack",
    price: 99.99,
    frequency: "month",
    description: "Best value for households",
    features: [
      "Choose 4 supplements",
      "25% off retail price",
      "Free express shipping",
      "Triple loyalty points",
      "VIP customer support",
      "Monthly wellness consultation",
      "Early access to new products",
    ],
    popular: false,
  },
]

const loyaltyTiers = [
  { name: "Bronze", minPoints: 0, benefits: ["1 point per $1 spent", "Member-only promotions"] },
  { name: "Silver", minPoints: 250, benefits: ["1.5x points", "Birthday bonus", "Free shipping on all orders"] },
  {
    name: "Gold",
    minPoints: 500,
    benefits: ["2x points", "$10 quarterly credit", "Priority support", "Exclusive products"],
  },
  {
    name: "Platinum",
    minPoints: 1000,
    benefits: ["3x points", "$25 quarterly credit", "Free express shipping", "VIP events access"],
  },
]

const wellnessBoxes = [
  {
    name: "Immunity Boost Box",
    price: 79.99,
    image: "/immune-health-fruits.jpg",
    items: ["Nano Vitamin D3", "Advanced Multivitamin", "Immunity Tea Blend"],
    savings: 25,
  },
  {
    name: "Energy & Focus Box",
    price: 89.99,
    image: "/energy-workout-fitness.jpg",
    items: ["CoQ10 Advanced", "Nano Iron Plus", "B-Complex Plus"],
    savings: 30,
  },
  {
    name: "Sleep & Relaxation Box",
    price: 69.99,
    image: "/daily-wellness-morning.jpg",
    items: ["Magnesium Complex", "Lavender Sleep Spray", "Calming Tea"],
    savings: 20,
  },
]

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a4d3e] via-[#2d6a5a] to-[#1a4d3e] text-white py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 px-4 py-2 rounded-full mb-6">
            <Crown className="h-5 w-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold">TOXNIL Wellness Club</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
            Subscribe & Save
            <br />
            <span className="text-[#D4AF37]">Up to 25%</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of members who trust TOXNIL for their daily wellness journey. Enjoy exclusive savings, free
            shipping, and loyalty rewards.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { icon: Truck, text: "Free Shipping" },
              { icon: Percent, text: "Up to 25% Off" },
              { icon: Gift, text: "Exclusive Rewards" },
              { icon: Clock, text: "Cancel Anytime" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <item.icon className="h-4 w-4" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Subscription Plans */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1a4d3e] font-playfair mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground">Flexible subscriptions tailored to your wellness needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.popular ? "border-[#D4AF37] border-2 scale-105" : ""
                } ${selectedPlan === plan.name ? "ring-2 ring-[#1a4d3e]" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1a4d3e] mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#1a4d3e]">₹{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.frequency}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-[#1a4d3e]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full ${plan.popular ? "bg-[#D4AF37] hover:bg-[#c9a432]" : "bg-[#1a4d3e] hover:bg-[#2d6a5a]"}`}
                >
                  {selectedPlan === plan.name ? "Selected" : "Subscribe Now"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Monthly Wellness Boxes */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a4d3e] font-playfair mb-4">Monthly Wellness Boxes</h2>
            <p className="text-muted-foreground">Curated supplement bundles delivered to your door</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {wellnessBoxes.map((box) => (
              <Card key={box.name} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={box.image || "/placeholder.svg"}
                    alt={box.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    SAVE ₹{box.savings}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1a4d3e] mb-2">{box.name}</h3>
                  <ul className="space-y-1 mb-4">
                    {box.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Gift className="h-3 w-3 text-[#D4AF37]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#1a4d3e]">₹{box.price}/mo</span>
                    <Button className="bg-[#1a4d3e] hover:bg-[#2d6a5a]">Subscribe</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Loyalty Program */}
        <Card className="p-8 bg-gradient-to-br from-[#1a4d3e] to-[#2d6a5a] text-white mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 px-4 py-2 rounded-full mb-4">
              <Star className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-semibold">Loyalty Rewards</span>
            </div>
            <h2 className="text-3xl font-bold font-playfair mb-4">TOXNIL Points Program</h2>
            <p className="text-white/80">Earn points on every purchase and unlock exclusive benefits</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {loyaltyTiers.map((tier, idx) => (
              <div key={tier.name} className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Crown
                    className={`h-6 w-6 ${idx === 0
                        ? "text-amber-600"
                        : idx === 1
                          ? "text-gray-400"
                          : idx === 2
                            ? "text-[#D4AF37]"
                            : "text-purple-400"
                      }`}
                  />
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  {tier.minPoints > 0 ? `${tier.minPoints}+ points` : "Starting tier"}
                </p>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, bidx) => (
                    <li key={bidx} className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* VIP Benefits */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1a4d3e] font-playfair mb-4">VIP Member Benefits</h2>
          <p className="text-muted-foreground">Exclusive perks for our most valued members</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Zap, title: "Early Access", desc: "Be first to try new products" },
            { icon: Gift, title: "Birthday Rewards", desc: "Special gift on your birthday" },
            { icon: Heart, title: "Wellness Consults", desc: "Free nutrition consultations" },
            { icon: Shield, title: "Extended Returns", desc: "60-day satisfaction guarantee" },
          ].map((benefit, idx) => (
            <Card key={idx} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[#1a4d3e]/10 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-7 w-7 text-[#1a4d3e]" />
              </div>
              <h3 className="font-semibold text-[#1a4d3e] mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="p-8 text-center bg-gradient-to-r from-emerald-50 to-[#F5F3F0]">
          <h2 className="text-2xl font-bold text-[#1a4d3e] font-playfair mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join over 50,000 happy subscribers and experience the TOXNIL difference. Start saving today with our
            flexible subscription options.
          </p>
          <Button size="lg" className="bg-[#1a4d3e] hover:bg-[#2d6a5a]">
            Get Started <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
