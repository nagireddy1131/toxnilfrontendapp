"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight, Leaf, Shield, Sparkles, TrendingUp, Heart, Brain, Zap,
  CheckCircle, FlaskConical, Globe, Award, Star, ChevronRight,
} from "lucide-react"
import { TrustMarquee } from "@/components/trust-marquee"
import { NanoTechnologySection } from "@/components/nano-technology-section"
import { SiteHeader } from "@/components/site-header"
import { StickyUIElements } from "@/components/sticky-ui-elements"
import { IngredientsCarousel } from "@/components/ingredients-carousel"
import { AnimatedStats } from "@/components/animated-stats"
import { HeroCarousel } from "@/components/hero-carousel"
import { ScrollReveal } from "@/components/scroll-reveal"
import { HealthQuizModal } from "@/components/health-quiz-modal"
import { PersonalizedProducts } from "@/components/personalized-products"

export default function HomePage() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizKey, setQuizKey] = useState(0)       // remount modal when "Edit" clicked
  const [goalsVersion, setGoalsVersion] = useState(0) // bumps after quiz save → re-fetches products

  useEffect(() => {
    // Show quiz on first visit only
    const alreadySet = localStorage.getItem("healthGoalsSet")
    if (!alreadySet) {
      setShowQuiz(true)
    }
  }, [])

  const handleQuizClose = () => {
    setShowQuiz(false)
    // Always bump so PersonalizedProducts re-fetches with the latest goals
    setGoalsVersion((v) => v + 1)
  }

  const handleEditGoals = () => {
    setQuizKey((k) => k + 1)
    setShowQuiz(true)
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Health Quiz Modal — shown on first visit */}
      {showQuiz && <HealthQuizModal key={quizKey} onClose={handleQuizClose} />}

      <StickyUIElements />
      <SiteHeader />

      {/* Hero Section */}
      <section id="hero" className="w-full px-4 md:px-6 relative">
        {/* Animated blob orbs behind hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl animate-blob" />
          <div className="absolute top-40 right-[15%] h-56 w-56 rounded-full bg-[#d4af37]/15 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-[40%] h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl animate-blob animation-delay-4000" />
        </div>
        <HeroCarousel />
      </section>

      <TrustMarquee />

      {/* Personalized Products Section — key forces re-mount on goals change */}
      <PersonalizedProducts key={goalsVersion} onEditGoals={handleEditGoals} />

      {/* Animated Stats Bar */}
      <AnimatedStats />

      {/* Nano Absorption Comparison */}
      <section className="py-16 bg-gradient-to-r from-emerald-950 to-[#1a3d2e] text-white overflow-hidden relative">
        {/* Decorative orb */}
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-5xl relative">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-emerald-300 text-sm font-semibold uppercase tracking-widest">The TOXNIL Difference</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 font-playfair">Why Our Supplements Work Better</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <ScrollReveal stagger={1}>
              <div className="space-y-6">
                {[
                  { label: "TOXNIL Nano Formula", pct: 95, color: "bg-emerald-400" },
                  { label: "Standard Capsule", pct: 20, color: "bg-gray-400" },
                  { label: "Powder Supplement", pct: 30, color: "bg-blue-400" },
                  { label: "Regular Tablet", pct: 15, color: "bg-red-400" },
                ].map((item, i) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-bold text-emerald-300">{item.pct}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full bar-fill`}
                        style={{ width: `${item.pct}%`, transitionDelay: `${i * 200}ms` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-emerald-200 text-sm mt-4">* Bioavailability absorption rate comparison</p>
              </div>
            </ScrollReveal>
            <ScrollReveal stagger={2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FlaskConical, label: "Nano-Sized", desc: "1–100nm particles" },
                  { icon: CheckCircle, label: "10x Absorbed", desc: "vs traditional pills" },
                  { icon: Globe, label: "Natural Origin", desc: "Zero synthetic fillers" },
                  { icon: Award, label: "Lab Certified", desc: "3rd party tested" },
                ].map((f) => (
                  <div key={f.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                    <f.icon className="h-7 w-7 text-emerald-300 mb-2" />
                    <p className="font-bold text-white">{f.label}</p>
                    <p className="text-xs text-emerald-200 mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5a7a77]">Explore</span>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 font-playfair">Shop by Health Goal</h2>
              <p className="text-lg text-muted-foreground">Find the perfect supplements for your wellness journey</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { name: "Heart Health", icon: Heart, color: "bg-rose-100 text-rose-700", hover: "hover:bg-rose-200", href: "/products?category=Heart+Health" },
              { name: "Immunity", icon: Shield, color: "bg-orange-100 text-orange-700", hover: "hover:bg-orange-200", href: "/products?category=Immunity" },
              { name: "Digestive Health", icon: Sparkles, color: "bg-sky-100 text-sky-700", hover: "hover:bg-sky-200", href: "/products?category=Digestive+Health" },
              { name: "Sleep & Relaxation", icon: Brain, color: "bg-violet-100 text-violet-700", hover: "hover:bg-violet-200", href: "/products?category=Sleep+%26+Relaxation" },
              { name: "Energy", icon: Zap, color: "bg-amber-100 text-amber-700", hover: "hover:bg-amber-200", href: "/products?category=Energy" },
            ].map((category, i) => (
              <ScrollReveal key={category.name} stagger={(i + 1) as 1 | 2 | 3 | 4 | 5}>
                <Link href={category.href}>
                  <Card className="p-5 md:p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group border-0 shadow-sm">
                    <div className="flex flex-col items-center space-y-3 text-center">
                      <div className={`h-14 w-14 md:h-16 md:w-16 rounded-full ${category.color} ${category.hover} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                        <category.icon className="h-7 w-7 md:h-8 md:w-8" />
                      </div>
                      <h3 className="font-semibold text-xs md:text-sm">{category.name}</h3>
                    </div>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-[#1a4d3e] to-[#0f2e26] text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Simple Process</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 font-playfair">How It Works</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="absolute top-8 left-1/6 right-1/6 h-0.5 bg-white/10 hidden md:block" />
            {[
              { step: "01", title: "Take the Quiz", desc: "Tell us your health goals in 30 seconds", icon: "🎯" },
              { step: "02", title: "We Recommend", desc: "Get your personalised nano-supplement stack", icon: "✨" },
              { step: "03", title: "See Results", desc: "Feel the difference in as little as 30 days", icon: "🚀" },
            ].map((s, i) => (
              <ScrollReveal key={s.step} stagger={(i + 1) as 1 | 2 | 3}>
                <div className="text-center relative">
                  <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mx-auto mb-4 text-2xl">
                    {s.icon}
                  </div>
                  <div className="text-[#d4af37] text-xs font-bold mb-1">{s.step}</div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-emerald-200 text-sm">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="text-center mt-10">
              <Button
                onClick={handleEditGoals}
                className="bg-[#d4af37] hover:bg-[#c49d25] text-[#1a4d3e] font-bold px-8 h-12 rounded-xl text-sm hover:scale-105 transition-all"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Take the Health Quiz
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="education" className="py-20 bg-[#F5F3F0]">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5a7a77]">Our Promise</span>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 font-playfair">Why Choose TOXNIL?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our advanced nanotechnology ensures maximum bioavailability and efficacy
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: Sparkles, title: "Nano-Enhanced", desc: "Advanced nanotechnology for superior cellular absorption", color: "emerald" },
              { Icon: Shield, title: "Clinically Tested", desc: "Every formula is backed by rigorous scientific research", color: "emerald" },
              { Icon: Leaf, title: "Natural Ingredients", desc: "100% natural, sustainably sourced premium ingredients", color: "emerald" },
              { Icon: TrendingUp, title: "Proven Results", desc: "Enhanced bioavailability for faster, better results", color: "emerald" },
            ].map((item, i) => (
              <ScrollReveal key={item.title} stagger={(i + 1) as 1 | 2 | 3 | 4}>
                <Card className="p-6 space-y-4 border-0 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 transition-transform duration-300 bg-white">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <item.Icon className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-xl font-semibold font-playfair">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <NanoTechnologySection />

      {/* Expert Testimonials */}
      <section id="reviews" className="py-20 bg-emerald-50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5a7a77]">Trusted By Experts</span>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 font-playfair">What Leading Experts Say</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Dr. Sarah Johnson", title: "Functional Medicine Specialist", quote: "TOXNIL's nanotechnology approach represents a breakthrough in supplement bioavailability. I confidently recommend their products to my patients.", rating: 5 },
              { name: "Dr. Michael Chen", title: "Integrative Health Expert", quote: "The clinical research behind TOXNIL's formulations is impressive. Their commitment to quality and efficacy sets them apart in the wellness industry.", rating: 5 },
              { name: "Dr. Emily Roberts", title: "Nutritional Biochemist", quote: "I've seen remarkable results with TOXNIL supplements. The nano-enhanced absorption technology delivers real, measurable health improvements.", rating: 5 },
            ].map((expert, i) => (
              <ScrollReveal key={expert.name} stagger={(i + 1) as 1 | 2 | 3}>
                <Card className="p-6 space-y-4 border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(expert.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#d4af37] text-[#d4af37]" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic text-sm leading-relaxed">&ldquo;{expert.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {expert.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-900 text-sm">{expert.name}</h4>
                      <p className="text-xs text-muted-foreground">{expert.title}</p>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      <IngredientsCarousel />

      {/* Social proof marquee */}
      <section className="py-8 bg-white overflow-hidden border-y border-gray-100">
        <div className="flex animate-announcement">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex flex-shrink-0 items-center gap-8 pr-8">
              {[
                { name: "Priya S.", goal: "Heart Health", quote: "Noticed a real difference in 3 weeks!" },
                { name: "Rahul M.", goal: "Energy", quote: "My afternoon slump is completely gone." },
                { name: "Deepa K.", goal: "Sleep", quote: "Best sleep I've had in years." },
                { name: "Arjun T.", goal: "Immunity", quote: "Haven't fallen sick since I started!" },
                { name: "Meena R.", goal: "Gut Health", quote: "Digestion improved noticeably." },
                { name: "Vikram P.", goal: "Joints", quote: "Morning stiffness is a thing of the past." },
              ].map((r) => (
                <div key={`${ri}-${r.name}`} className="flex items-center gap-3 bg-[#f9f7f5] rounded-full px-5 py-2.5 flex-shrink-0 border border-gray-100">
                  <div className="flex">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-[#d4af37] text-[#d4af37]" />)}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">&ldquo;{r.quote}&rdquo;</span>
                  <span className="text-xs text-gray-400">— {r.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Wellness Insights */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5a7a77]">Learn</span>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 font-playfair">Wellness Insights</h2>
              <p className="text-lg text-muted-foreground">Latest research and tips for optimal health</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Understanding Nanotechnology in Supplements", excerpt: "Discover how nano-enhanced formulations revolutionize nutrient absorption and bioavailability.", category: "Science", emoji: "🔬" },
              { title: "5 Signs Your Body Needs Better Nutrients", excerpt: "Learn to recognize the subtle signals that indicate your body needs enhanced nutritional support.", category: "Health Tips", emoji: "💪" },
              { title: "The Complete Guide to Heart Health", excerpt: "Expert advice on maintaining cardiovascular wellness through proper nutrition and supplements.", category: "Wellness", emoji: "❤️" },
            ].map((article, i) => (
              <ScrollReveal key={article.title} stagger={(i + 1) as 1 | 2 | 3}>
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow border-0 shadow-sm bg-white">
                  <div className="h-40 bg-gradient-to-br from-emerald-50 to-[#F5F3F0] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                    {article.emoji}
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">{article.category}</p>
                    <h3 className="text-lg font-semibold line-clamp-2 font-playfair">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <Link href="/blog" className="inline-flex items-center text-emerald-700 font-medium hover:text-emerald-800 text-sm">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Available On */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-emerald-900">Available On</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 opacity-60">
              {["Amazon", "Flipkart", "HealthKart", "Nykaa", "1mg"].map((platform) => (
                <div key={platform} className="px-5 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <span className="text-base font-bold text-gray-700">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="container mx-auto px-4 pb-6 flex justify-start pointer-events-auto">
          {/* The chatbot button occupies the right side, so we put a small CTA left if no quiz done */}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-emerald-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-[#d4af37]" />
                <span className="text-xl font-bold">TOXNIL</span>
              </div>
              <p className="text-emerald-200 text-sm">Advanced nanotechnology wellness for a healthier tomorrow.</p>
              <div className="flex gap-3 mt-4">
                {["Instagram", "Twitter", "YouTube"].map((s) => (
                  <div key={s} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors text-xs font-bold text-emerald-300">
                    {s[0]}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Shop</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                {[["All Products", "/products"], ["Immunity", "/products?category=Immunity"], ["Energy", "/products?category=Energy"], ["Heart Health", "/products?category=Heart+Health"]].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                {[["About Us", "/about"], ["Contact", "/contact"], ["Blog", "/blog"]].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                {[["FAQ", "/faq"], ["Help Center", "/contact"], ["Track Order", "/account"]].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-sm text-emerald-400">
            &copy; {new Date().getFullYear()} TOXNIL. All rights reserved. Made with 🌿 in India.
          </div>
        </div>
      </footer>
    </div>
  )
}

// Featured products section as a separate client component
function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/products?limit=3`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        const all = Array.isArray(data) ? data : (data.products || [])
        setProducts(all.slice(0, 3))
      })
      .catch(() => {})
  }, [])

  return (
    <section id="shop" className="py-20 bg-[#F5F3F0]">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5a7a77]">Best Sellers</span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 font-playfair">Featured Products</h2>
            <p className="text-lg text-muted-foreground">Discover our most popular wellness solutions</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <ScrollReveal key={product._id || i} stagger={(i + 1) as 1 | 2 | 3}>
              <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative border-0 shadow-sm bg-white">
                {product.originalPrice && product.price < product.originalPrice && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
                <Link href={`/products/${product._id}`} className="block">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-[#F5F3F0]">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-5 space-y-3">
                  <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">{product.category}</p>
                  <Link href={`/products/${product._id}`}>
                    <h3 className="text-lg font-semibold hover:text-emerald-700 transition-colors font-playfair">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < Math.floor(product.rating) ? "fill-[#d4af37] text-[#d4af37]" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviewCount?.toLocaleString() || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-800">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <Link href={`/products/${product._id}`}>
                      <Button size="sm" className="bg-[#1a4d3e] hover:bg-[#2d6a5a] text-sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg" className="border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
