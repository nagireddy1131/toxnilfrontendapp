"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, ArrowUp, X, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { SocialProofToast } from "@/components/social-proof-toast"
import { WhatsAppButton } from "@/components/whatsapp-button"

export function StickyUIElements() {
  const { items: cartItems, updateQuantity, removeItem, subtotal, cartCount } = useCart()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showShopNow, setShowShopNow] = useState(false)
  const [showMiniCart, setShowMiniCart] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
      setShowBackToTop(scrollTop > 800)
      setShowShopNow(scrollTop > 400)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Social Proof Toast */}
      <SocialProofToast />

      {/* WhatsApp Support Button */}
      <WhatsAppButton />

      {/* Scroll Progress Bar */}
      {mounted && (
        <div className="fixed top-0 left-0 right-0 z-[1100] h-1 bg-gray-200/50">
          <div
            className="h-full bg-gradient-to-r from-[#1a4d3e] via-[#2d6a5a] to-[#D4AF37] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* Floating Shop Now Button */}
      <div
        className={`fixed right-6 bottom-32 z-[900] transition-all duration-500 ${
          showShopNow ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20 pointer-events-none"
        }`}
      >
        <Link href="/products">
          <Button className="bg-gradient-to-r from-[#1a4d3e] to-[#2d6a5a] hover:from-[#2d6a5a] hover:to-[#1a4d3e] text-white px-6 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Shop Now
          </Button>
        </Link>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-20 z-[900] w-12 h-12 rounded-full bg-[#1a4d3e] text-white shadow-lg hover:shadow-xl hover:bg-[#2d6a5a] transition-all duration-500 flex items-center justify-center ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Sticky Mini Cart Toggle */}
      <button
        onClick={() => setShowMiniCart(!showMiniCart)}
        className={`fixed right-6 bottom-6 z-[900] w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#c9a432] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          showShopNow ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Toggle mini cart"
      >
        <ShoppingBag className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Mini Cart Panel */}
      <div
        className={`fixed right-6 bottom-24 z-[950] w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 overflow-hidden ${
          showMiniCart ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#1a4d3e] to-[#2d6a5a]">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({cartCount})
          </h3>
          <button onClick={() => setShowMiniCart(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="max-h-64 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Your cart is empty</p>
              <Link href="/products" onClick={() => setShowMiniCart(false)}>
                <Button size="sm" className="mt-3 bg-[#1a4d3e] hover:bg-[#2d6a5a] text-white text-xs">
                  Shop Now
                </Button>
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-emerald-50 flex-shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                  <p className="text-sm text-[#1a4d3e] font-semibold">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-lg font-bold text-[#1a4d3e]">₹{subtotal.toFixed(2)}</span>
            </div>
            <Link href="/cart" className="block" onClick={() => setShowMiniCart(false)}>
              <Button className="w-full bg-[#1a4d3e] hover:bg-[#2d6a5a] text-white">View Cart</Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white bg-transparent"
              onClick={() => {
                const userInfo = localStorage.getItem("userInfo")
                setShowMiniCart(false)
                window.location.href = userInfo ? "/checkout" : "/login?redirect=/checkout"
              }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
