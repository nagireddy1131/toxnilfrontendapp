"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    label: "Build Your",
    heading: "Wellness Stack",
    subheading: "Pick any 3 Supplements",
    price: "₹1999/-",
    body: "Create your personalized wellness routine with our premium nano-enhanced supplements",
    bgGradient: "from-[#E8F3E8] via-[#F0EBE5] to-[#F5EFE8]",
    link: "/products?category=Daily+Wellness",
    products: [
      "/curcumin-supplement-bottle.png",
      "/omega-3-fish-oil-bottle.png",
      "/multivitamin-supplement-bottle.png",
    ],
  },
  {
    label: "Boost Your",
    heading: "Immunity Shield",
    subheading: "Complete Immunity Bundle",
    price: "₹2499/-",
    body: "Advanced immune support with Vitamin D3, Zinc, and our proprietary nano-curcumin formula",
    bgGradient: "from-[#E8F5F3] via-[#EEF3F0] to-[#F0F5E8]",
    link: "/products?category=Immunity",
    products: ["/vitamin-d3-supplement.png", "/curcumin-supplement-bottle.png", "/multivitamin-supplement-bottle.png"],
  },
  {
    label: "Enhance Your",
    heading: "Energy & Focus",
    subheading: "Peak Performance Pack",
    price: "₹1799/-",
    body: "Stay sharp and energized with CoQ10, Omega-3, and essential B-vitamins",
    bgGradient: "from-[#FFF5E8] via-[#FFF0DD] to-[#F9DCC4]",
    link: "/products?category=Energy",
    products: ["/coq10-supplement.png", "/omega-3-fish-oil-bottle.png", "/multivitamin-supplement-bottle.png"],
  },
  {
    label: "Support Your",
    heading: "Heart Health",
    subheading: "Cardiovascular Wellness Kit",
    price: "₹2199/-",
    body: "Premium heart support with Omega-3, CoQ10, and Magnesium for optimal cardiovascular function",
    bgGradient: "from-[#FFE8E8] via-[#F8F3E8] to-[#FFD5CC]",
    link: "/products?category=Heart+Health",
    products: ["/omega-3-fish-oil-bottle.png", "/coq10-supplement.png", "/magnesium-supplement.png"],
  },
  {
    label: "Strengthen Your",
    heading: "Bone & Joint",
    subheading: "Mobility Support Bundle",
    price: "₹1899/-",
    body: "Complete bone and joint care with Vitamin D3, Calcium, and anti-inflammatory curcumin",
    bgGradient: "from-[#E8F0F5] via-[#EEF5F0] to-[#E8F5E8]",
    link: "/products?category=Anti-Inflammatory",
    products: ["/vitamin-d3-supplement.png", "/curcumin-supplement-bottle.png", "/magnesium-supplement.png"],
  },
  {
    label: "Optimize Your",
    heading: "Digestive Health",
    subheading: "Gut Wellness Package",
    price: "₹1699/-",
    body: "Restore balance with probiotics, digestive enzymes, and inflammation support",
    bgGradient: "from-[#F0E8F5] via-[#F5F0E8] to-[#E8F0F5]",
    link: "/products?category=Digestive+Health",
    products: ["/probiotic-supplement.png", "/curcumin-supplement-bottle.png", "/multivitamin-supplement-bottle.png"],
  },
  {
    label: "Elevate Your",
    heading: "Daily Wellness",
    subheading: "Complete Nutrition Stack",
    price: "₹2299/-",
    body: "Everything you need for optimal health with our comprehensive daily supplement bundle",
    bgGradient: "from-[#E8F3E8] via-[#F0F5E8] to-[#E8F5F0]",
    link: "/products?category=Daily+Wellness",
    products: [
      "/multivitamin-supplement-bottle.png",
      "/omega-3-fish-oil-bottle.png",
      "/vitamin-d3-supplement.png",
      "/magnesium-supplement.png",
    ],
  },
  {
    label: "Maximize Your",
    heading: "Anti-Aging",
    subheading: "Youth & Vitality Collection",
    price: "₹2599/-",
    body: "Fight cellular aging with powerful antioxidants, CoQ10, and resveratrol complex",
    bgGradient: "from-[#FFE8F0] via-[#F8E8F5] to-[#F0E8FF]",
    link: "/products?category=Anti-Inflammatory",
    products: ["/coq10-supplement.png", "/curcumin-supplement-bottle.png", "/omega-3-fish-oil-bottle.png"],
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isHovered])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    console.log("[v0] goToSlide called with index:", index)
    setCurrentSlide(index)
  }

  return (
    <div
      className="relative w-full h-[350px] md:h-[550px] rounded-2xl overflow-hidden mx-auto my-5 max-w-[1400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
          style={{ pointerEvents: index === currentSlide ? "auto" : "none" }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`}>
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-[rgba(26,77,62,0.03)]" />

            {/* Decorative leaf elements with blur */}
            <svg
              className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 text-emerald-300/40 blur-[12px] rotate-12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.67C7.91 17.17 10.91 12.67 17 11v2l7-4-7-4v3z" />
            </svg>
            <svg
              className="absolute top-5 left-5 w-24 h-24 md:w-36 md:h-36 text-teal-300/50 blur-[10px] -rotate-45 scale-[2.5]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.67C7.91 17.17 10.91 12.67 17 11v2l7-4-7-4v3z" />
            </svg>
            <svg
              className="absolute bottom-10 left-10 w-20 h-20 md:w-32 md:h-32 text-emerald-400/30 blur-[8px] rotate-[25deg] scale-[3]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.67C7.91 17.17 10.91 12.67 17 11v2l7-4-7-4v3z" />
            </svg>
            <svg
              className="absolute bottom-20 right-20 w-28 h-28 md:w-40 md:h-40 text-teal-400/40 blur-[15px] -rotate-[30deg] scale-[2]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.67C7.91 17.17 10.91 12.67 17 11v2l7-4-7-4v3z" />
            </svg>
          </div>

          <div className="container mx-auto px-6 md:px-10 h-full flex items-center relative z-10">
            <div className="grid md:grid-cols-2 gap-8 w-full items-center">
              <div className="space-y-3 md:space-y-4">
                <p className="text-[12px] md:text-[14px] font-medium text-[#5A7A77] tracking-[0.5px] opacity-80 font-[family-name:var(--font-montserrat)]">
                  {slide.label}
                </p>
                <h2 className="text-[32px] md:text-[56px] leading-[1.2] font-bold text-[#1a4d3e] tracking-tight font-[family-name:var(--font-playfair)]">
                  {slide.heading}
                </h2>
                <p className="text-[18px] md:text-[24px] font-semibold text-[#2C3E50] leading-relaxed font-[family-name:var(--font-inter)]">
                  {slide.subheading}
                </p>
                <p className="text-[20px] md:text-[28px] font-bold text-[#1a4d3e] font-[family-name:var(--font-montserrat)]">
                  @ {slide.price}
                </p>
                <p className="text-[14px] md:text-[16px] text-[#5A7A77] leading-relaxed max-w-lg font-[family-name:var(--font-inter)]">
                  {slide.body}
                </p>
                <Link href={slide.link} passHref>
                  <Button
                    size="lg"
                    className="bg-[#1a4d3e] hover:bg-[#2C3E50] text-white mt-4 px-8 py-6 text-[15px] font-semibold rounded-full transition-all duration-300 hover:scale-105 font-[family-name:var(--font-inter)]"
                  >
                    Shop Now
                  </Button>
                </Link>
              </div>

              {/* Right side: Product images */}
              <div className="relative h-64 md:h-96 hidden md:flex items-center justify-center">
                <div className="flex items-center justify-center gap-4 h-full">
                  {slide.products.map((product, i) => (
                    <div
                      key={i}
                      className="relative animate-in fade-in slide-in-from-right-10 duration-700"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <img
                        src={product || "/placeholder.svg"}
                        alt={`Product ${i + 1}`}
                        className="h-48 md:h-72 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-[4] h-11 w-11 rounded-full bg-white/70 hover:bg-white/95 border-none flex items-center justify-center opacity-60 hover:opacity-100 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 active:scale-95 active:bg-[#1a4d3e] group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-[#1a4d3e] group-active:text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-[4] h-11 w-11 rounded-full bg-white/70 hover:bg-white/95 border-none flex items-center justify-center opacity-60 hover:opacity-100 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 active:scale-95 active:bg-[#1a4d3e] group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-[#1a4d3e] group-active:text-white" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-[10] items-center justify-center">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goToSlide(index)
            }}
            className={`rounded-full transition-all duration-300 cursor-pointer pointer-events-auto ${index === currentSlide
              ? "h-3 w-3 bg-[#1a4d3e] border-2 border-[#1a4d3e] shadow-[0_0_0_3px_rgba(26,77,62,0.2)]"
              : "h-3 w-3 bg-white/80 border-2 border-[#1a4d3e]/40 hover:border-[#1a4d3e] hover:bg-[#1a4d3e]/30 hover:scale-125"
              }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-5 left-5 z-[5] text-[14px] text-[#1a4d3e] opacity-70 font-[family-name:var(--font-inter)]">
        {currentSlide + 1}/{slides.length}
      </div>
    </div>
  )
}
