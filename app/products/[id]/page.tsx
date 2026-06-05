"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Plus, Minus, Star, Shield, Truck, RefreshCw, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { SiteHeader } from "@/components/site-header"
import { ReviewSection } from "@/components/review-section"
// import { products } from "@/lib/data"
import api from "@/lib/api"
import { useCart } from "@/components/cart-provider"

interface Product {
  _id: string
  id?: string
  name: string
  category: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  description: string
  fullDescription: string
  inStock: boolean
  rating: number
  reviewCount: number
  benefits: string[]
  dosage: string
  ingredients: string
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  // const product = products.find((p) => p.id === Number.parseInt(resolvedParams.id))
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${resolvedParams.id}`)
        setProduct(data)
      } catch (error) {
        console.error("Failed to fetch product", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [resolvedParams.id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F3F0]">Loading...</div>
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3F0]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products">
            <Button className="bg-[#1a4d3e] hover:bg-[#2d6a5a]">Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity,
    })

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    })
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <Toaster />
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-[#1a4d3e]">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#1a4d3e]">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-[#F5F3F0] shadow-lg relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[#5A7A77] font-semibold uppercase tracking-wider mb-2">{product.category}</p>
                <h1 className="text-4xl font-bold text-[#1a4d3e] mb-4 font-playfair">{product.name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-[#1a4d3e]">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                      <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                        Save ₹{(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground">{product.fullDescription}</p>

              {/* Benefits */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-[#1a4d3e]">Key Benefits:</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#1a4d3e]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-[#1a4d3e]" />
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-[#1a4d3e]/20 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="hover:bg-[#1a4d3e]/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-6 font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="hover:bg-[#1a4d3e]/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 bg-[#1a4d3e] hover:bg-[#2d6a5a] h-12 text-lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white bg-transparent"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-[#1a4d3e]/10 flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-[#1a4d3e]" />
                  </div>
                  <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-[#1a4d3e]/10 flex items-center justify-center mx-auto">
                    <Truck className="h-6 w-6 text-[#1a4d3e]" />
                  </div>
                  <p className="text-xs text-muted-foreground">Free Shipping ₹999+</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-[#1a4d3e]/10 flex items-center justify-center mx-auto">
                    <RefreshCw className="h-6 w-6 text-[#1a4d3e]" />
                  </div>
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-white border-0 shadow-md">
              <h3 className="font-semibold text-lg mb-4 text-[#1a4d3e]">Dosage & Usage</h3>
              <p className="text-muted-foreground">{product.dosage}</p>
            </Card>
            <Card className="p-6 bg-white border-0 shadow-md">
              <h3 className="font-semibold text-lg mb-4 text-[#1a4d3e]">Ingredients</h3>
              <p className="text-muted-foreground">{product.ingredients}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewSection productId={product._id} productName={product.name} rating={product.rating} reviewCount={product.reviewCount} />
    </div>
  )
}
