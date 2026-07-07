"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, Eye, CheckCircle2, ArrowLeft, X } from "lucide-react"
import api from "@/lib/api"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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
  const [products, setProducts] = useState<any[]>([])
  const [selectedBundle, setSelectedBundle] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products')
        const allProducts = Array.isArray(data) ? data : (data.products || [])
        setProducts(allProducts)
      } catch (error) {
        console.error("Failed to fetch products for carousel", error)
      }
    }
    fetchProducts()
  }, [])

  const handleShopNowClick = (slide: any) => {
    const matchingBundle = products.find(p => p.name.toLowerCase() === slide.heading.toLowerCase())
    if (matchingBundle) {
      setSelectedBundle(matchingBundle)
      setIsModalOpen(true)
    } else {
      window.location.href = slide.link
    }
  }

  const handleAddBundleToCart = () => {
    if (!selectedBundle) return
    addItem({
      id: selectedBundle._id || selectedBundle.id,
      name: selectedBundle.name,
      price: selectedBundle.price,
      image: selectedBundle.image,
      category: selectedBundle.category,
    })
    toast({
      title: "Stack Added to Cart ✓",
      description: `${selectedBundle.name} has been added to your cart for ₹${selectedBundle.price}`,
    })
    setIsModalOpen(false)
  }

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
      className="relative w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden mx-auto my-5 max-w-[1400px]"
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
            <div className="absolute inset-0 bg-[rgba(26,77,62,0.03)]" />
            {/* Decorative leaves — desktop only */}
            <svg className="hidden md:block absolute top-10 right-10 w-48 h-48 text-emerald-300/40 blur-[12px] rotate-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.67C7.91 17.17 10.91 12.67 17 11v2l7-4-7-4v3z" />
            </svg>
            <svg className="hidden md:block absolute bottom-20 right-20 w-40 h-40 text-teal-400/40 blur-[15px] -rotate-[30deg] scale-[2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.67C7.91 17.17 10.91 12.67 17 11v2l7-4-7-4v3z" />
            </svg>
          </div>

          {/* Mobile layout: image on top, text below */}
          <div className="md:hidden h-full flex flex-col px-4 pt-6 pb-14 relative z-10">
            <div className="flex-1 flex items-center justify-center">
              <img
                src={slide.products[0] || "/placeholder.svg"}
                alt="Product"
                className="h-full max-h-[220px] w-auto object-contain drop-shadow-2xl"
              />
            </div>
            <div className="text-center space-y-1 pb-2">
              <p className="text-[10px] font-bold text-[#1a4d3e] uppercase tracking-widest opacity-80">
                {slide.label}
              </p>
              <h2 className="text-[22px] leading-tight font-bold text-[#1a4d3e]">
                {slide.heading}
              </h2>
              <p className="text-[12px] font-medium text-[#2C3E50]">{slide.subheading}</p>
              <p className="text-[14px] font-bold text-[#1a4d3e]">{slide.price}</p>
              <Button
                size="sm"
                className="bg-[#1a4d3e] hover:bg-[#2C3E50] text-white px-6 rounded-full shadow-md text-[12px]"
                onClick={() => handleShopNowClick(slide)}
              >
                Shop Now
              </Button>
            </div>
          </div>

          {/* Desktop layout: side-by-side */}
          <div className="hidden md:flex container mx-auto px-10 h-full items-center relative z-10">
            <div className="grid grid-cols-2 gap-8 w-full items-center">
              <div className="space-y-4">
                <p className="text-[13px] font-bold text-[#1a4d3e] uppercase tracking-[2px] opacity-80">
                  {slide.label}
                </p>
                <h2 className="text-[52px] leading-[1.1] font-bold text-[#1a4d3e] tracking-tight">
                  {slide.heading}
                </h2>
                <p className="text-[22px] font-semibold text-[#2C3E50] leading-relaxed">
                  {slide.subheading}
                </p>
                <p className="text-[26px] font-bold text-[#1a4d3e]">
                  @ {slide.price}
                </p>
                <p className="text-[15px] text-[#5A7A77] leading-relaxed max-w-lg">
                  {slide.body}
                </p>
                  <Button
                    size="lg"
                    className="bg-[#1a4d3e] hover:bg-[#2C3E50] text-white mt-2 px-8 py-6 text-[15px] font-semibold rounded-full transition-all duration-300 hover:scale-105"
                    onClick={() => handleShopNowClick(slide)}
                  >
                    Shop Now
                  </Button>
              </div>
              <div className="relative h-96 flex items-center justify-center">
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
                        className="h-60 md:h-72 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[4] h-8 w-8 md:h-11 md:w-11 rounded-full bg-white/70 hover:bg-white border-none flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-[#1a4d3e]" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[4] h-8 w-8 md:h-11 md:w-11 rounded-full bg-white/70 hover:bg-white border-none flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-[#1a4d3e]" />
      </button>

      {/* Pill-style dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex gap-1.5 z-[10] items-center justify-center">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => { e.preventDefault(); goToSlide(index) }}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? "w-6 bg-[#1a4d3e]" : "w-2 bg-[#1a4d3e]/30 hover:bg-[#1a4d3e]/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter — desktop only */}
      <div className="hidden md:block absolute bottom-4 left-5 z-[5] text-[13px] text-[#1a4d3e] opacity-60">
        {currentSlide + 1}/{slides.length}
      </div>

      {/* Bundle Quick View Dialog */}
      {selectedBundle && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            showCloseButton={false}
            className="w-[95vw] max-w-6xl bg-gradient-to-br from-[#F9F8F6] to-[#EEF5EE] border-none shadow-2xl rounded-3xl p-0 overflow-hidden flex flex-col
                       top-[70px] translate-y-0 max-h-[calc(100vh-90px)]"
          >

            {/* Top hero banner */}
            <div className="relative bg-gradient-to-r from-[#1a4d3e] to-[#2d6a5a] px-8 py-6 flex-shrink-0">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />

              {/* Close button — top-right */}
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 text-white/80 hover:text-white bg-white/15 hover:bg-white/25 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 border border-white/20"
              >
                <X className="h-3.5 w-3.5" />
                Close
              </button>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: badge + title + description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                      Exclusive Stack Offer
                    </span>
                  </div>
                  <DialogTitle className="text-3xl md:text-4xl font-bold font-playfair text-white mb-2">
                    {selectedBundle.name}
                  </DialogTitle>
                  <DialogDescription className="text-[14px] text-emerald-100/80 leading-relaxed max-w-xl">
                    {selectedBundle.description}
                  </DialogDescription>
                </div>

                {/* Right: price pill */}
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 text-center border border-white/10">
                  <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">Bundle Price</p>
                  <div className="flex items-baseline gap-2 justify-center">
                    <span className="text-4xl font-extrabold text-white">₹{selectedBundle.price}</span>
                    {selectedBundle.originalPrice && (
                      <span className="text-lg text-emerald-200/60 line-through">₹{selectedBundle.originalPrice}</span>
                    )}
                  </div>
                  {selectedBundle.discount && (
                    <span className="inline-block mt-1 bg-[#d4af37] text-[#1a4d3e] text-xs font-extrabold px-3 py-1 rounded-full">
                      {selectedBundle.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6">

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddBundleToCart}
                  className="flex-1 bg-[#1a4d3e] hover:bg-[#2C3E50] text-white rounded-full h-13 py-3.5 text-[15px] font-bold shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add Entire Stack to Cart
                </Button>
                <Link href={`/products/${selectedBundle._id || selectedBundle.id}`} onClick={() => setIsModalOpen(false)}>
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white rounded-full h-13 py-3.5 px-8 text-[15px] font-bold bg-transparent transition-all duration-200">
                    <Eye className="mr-2 h-5 w-5" /> View Full Details
                  </Button>
                </Link>
              </div>

              {/* Products included */}
              <div>
                <h3 className="text-lg font-bold text-[#1a4d3e] flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  What's Included in this Stack
                </h3>
                {/* Mobile: stacked horizontal cards | Desktop: 3-col vertical grid */}
                <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
                  {(() => {
                    const childProducts = selectedBundle.bundleProducts
                      ? selectedBundle.bundleProducts.map((childId: string) =>
                          products.find((p) => p._id === childId || p.id === childId)
                        ).filter(Boolean)
                      : [];

                    if (childProducts.length === 0) {
                      return (
                        <p className="text-sm text-muted-foreground py-6 text-center">
                          Loading included products...
                        </p>
                      );
                    }

                    return childProducts.map((product: any) => (
                      <div
                        key={product._id}
                        className="group bg-white rounded-2xl border border-[#1a4d3e]/8 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden
                                   flex flex-row md:flex-col"
                      >
                        {/* Image — left strip on mobile, top on desktop */}
                        <div className="
                          w-28 shrink-0 md:w-full md:h-48
                          bg-gradient-to-br from-emerald-50 via-[#F5F3F0] to-emerald-50/30
                          flex items-center justify-center p-3 md:p-5
                          relative overflow-hidden
                        ">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,77,62,0.05),transparent_70%)]" />
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-20 md:h-40 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Info — right on mobile, below on desktop */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] text-[#5A7A77] uppercase font-bold tracking-wider mb-1">
                              {product.category}
                            </p>
                            <h4 className="text-[14px] md:text-[15px] font-bold text-[#1a4d3e] leading-snug mb-1.5">
                              {product.name}
                            </h4>
                            <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 hidden sm:block">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[15px] font-extrabold text-[#1a4d3e]">₹{product.price}</span>
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                              Included ✓
                            </span>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>


              {/* Trust signals row */}

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1a4d3e]/10">
                {[
                  { icon: "🛡️", title: "Quality Guaranteed", sub: "Premium nano-formulas" },
                  { icon: "🚚", title: "Free Shipping", sub: "On orders above ₹999" },
                  { icon: "↩️", title: "30-Day Returns", sub: "Hassle-free guarantee" },
                ].map((t) => (
                  <div key={t.title} className="flex flex-col items-center text-center gap-1">
                    <span className="text-2xl">{t.icon}</span>
                    <p className="text-xs font-bold text-[#1a4d3e]">{t.title}</p>
                    <p className="text-[10px] text-muted-foreground">{t.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
