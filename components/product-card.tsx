"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"

export interface Product {
  _id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  description: string
  inStock: boolean
  rating: number
  reviewCount: number
}

import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-0 shadow-md">
      <Link href={`/products/${product._id}`}>
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-[#F5F3F0] relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discount && product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-semibold bg-black/70 px-4 py-2 rounded-full">Out of Stock</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      <div className="p-5 space-y-3">
        <p className="text-xs text-[#5A7A77] font-semibold uppercase tracking-wider">{product.category}</p>
        <Link href={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-[#1a4d3e] hover:text-[#2d6a5a] transition-colors font-playfair line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating)
                  ? "fill-[#D4AF37] text-[#D4AF37]"
                  : i < product.rating
                    ? "fill-[#D4AF37]/50 text-[#D4AF37]"
                    : "text-gray-300"
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1a4d3e]">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <Button
            size="sm"
            className="bg-[#1a4d3e] hover:bg-[#2d6a5a] transition-all duration-300 hover:scale-105"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {product.inStock ? "Add" : "Sold Out"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
