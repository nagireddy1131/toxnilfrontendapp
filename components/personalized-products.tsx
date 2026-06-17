"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, Sparkles, ArrowRight, Pencil } from "lucide-react"
import api from "@/lib/api"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

const GOAL_LABELS: Record<string, string> = {
  "Heart Health": "Heart Health",
  "Sleep & Relaxation": "Sleep & Mind",
  "Energy": "Energy & Focus",
  "Immunity": "Immunity",
  "Anti-Inflammatory": "Joints & Bones",
  "Digestive Health": "Gut Health",
}

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
}

interface PersonalizedProductsProps {
  onEditGoals: () => void
}

export function PersonalizedProducts({ onEditGoals }: PersonalizedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [goals, setGoals] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const savedGoals = localStorage.getItem("healthGoals")
    if (!savedGoals) { setLoading(false); return }

    const parsed: string[] = JSON.parse(savedGoals)
    setGoals(parsed)

    const fetchProducts = async () => {
      try {
        // Fetch products matching first 2 goals (keeps results focused)
        const targetGoals = parsed.slice(0, 2)
        const promises = targetGoals.map((g) =>
          api.get(`/products?category=${encodeURIComponent(g)}&limit=3`)
        )
        const results = await Promise.allSettled(promises)
        const all: Product[] = []
        for (const r of results) {
          if (r.status === "fulfilled") {
            const data = r.value.data
            const items = Array.isArray(data) ? data : (data.products || [])
            all.push(...items.map((p: any) => ({ ...p, _id: p._id || p.id })))
          }
        }
        // Deduplicate by _id, take first 4
        const seen = new Set<string>()
        const unique = all.filter((p) => {
          if (seen.has(p._id)) return false
          seen.add(p._id)
          return true
        })
        setProducts(unique.slice(0, 4))
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAdd = (product: Product) => {
    addItem({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 })
    toast({ title: "Added to cart ✓", description: product.name })
  }

  // Don't render if no goals set
  if (!loading && goals.length === 0) return null

  return (
    <section className="py-14 bg-gradient-to-b from-[#f0f7f4] to-[#F5F3F0]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-[#1a4d3e] flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1a4d3e]">
                Personalised For You
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a4d3e] font-playfair leading-tight">
              Your Recommended Stack
            </h2>
            {goals.length > 0 && (
              <p className="text-sm text-[#5a7a77] mt-1">
                Based on your interest in{" "}
                {goals.slice(0, 3).map((g, i) => (
                  <span key={g}>
                    <strong className="text-[#1a4d3e]">{GOAL_LABELS[g] || g}</strong>
                    {i < Math.min(goals.length, 3) - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </div>
          <button
            onClick={onEditGoals}
            className="flex items-center gap-1.5 text-xs text-[#5a7a77] hover:text-[#1a4d3e] transition-colors border border-[#1a4d3e]/20 rounded-full px-3 py-1.5 hover:border-[#1a4d3e]/50"
          >
            <Pencil className="h-3 w-3" /> Edit my goals
          </button>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#5a7a77] mb-4">No specific products found for your goals yet.</p>
            <Link href="/products">
              <Button className="bg-[#1a4d3e] hover:bg-[#2d6a5a]">
                Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href={`/products/${product._id}`}>
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-[#F5F3F0] relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded-full">Out of Stock</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-3 md:p-4">
                    <p className="text-[10px] md:text-xs text-[#5a7a77] font-semibold uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <Link href={`/products/${product._id}`}>
                      <h3 className="text-sm font-semibold text-[#1a4d3e] line-clamp-2 leading-tight hover:text-[#2d6a5a] transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-[#d4af37] text-[#d4af37]" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <span className="text-base font-bold text-[#1a4d3e]">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="h-7 px-2 text-[10px] bg-[#1a4d3e] hover:bg-[#2d6a5a]"
                        disabled={!product.inStock}
                        onClick={() => handleAdd(product)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-0.5" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href={`/products?category=${encodeURIComponent(goals[0] || "")}`}>
                <Button variant="outline" className="border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white">
                  See All Recommendations <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
