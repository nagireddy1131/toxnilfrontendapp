"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SiteHeader } from "@/components/site-header"
import { ProductCard } from "@/components/product-card"
// import { products, categories } from "@/lib/data" // Keep categories if static, or fetch them too. 
// For now assuming categories are still static in lib/data or we hardcode them, but let's keep the import for categories if it was there.
import { categories } from "@/lib/data"
import api from "@/lib/api"
import { Product } from "@/components/product-card"

function ProductsContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  // Initialize selectedCategories based on URL param
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (!categoryParam) return []
    // Find matching category from available categories (partial match)
    const match = categories.find(c => c.toLowerCase().includes(categoryParam.toLowerCase()))
    return match ? [match] : []
  })
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products')
        const allProducts = Array.isArray(data) ? data : (data.products || [])
        setProducts(allProducts.map((p: any) => ({ ...p, id: p._id })))
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const matchesStock = !showInStockOnly || product.inStock
    return matchesSearch && matchesCategory && matchesStock
  })

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <SiteHeader />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-[#1a4d3e] to-[#2d6a5a] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Our Products</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Discover our complete range of nano-enhanced wellness supplements, designed for maximum absorption and
            effectiveness.
          </p>
        </div>
      </section>

      {/* Products Grid with Filters */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 space-y-6 sticky top-24 bg-white shadow-md border-0">
                <div>
                  <h3 className="font-semibold text-lg text-[#1a4d3e] font-playfair">Filters</h3>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-[#1a4d3e]/20 focus:border-[#1a4d3e]"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <Label>Categories</Label>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        className="border-[#1a4d3e] data-[state=checked]:bg-[#1a4d3e]"
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Stock Status */}
                <div className="space-y-3">
                  <Label>Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={showInStockOnly}
                      onCheckedChange={(checked) => setShowInStockOnly(checked as boolean)}
                      className="border-[#1a4d3e] data-[state=checked]:bg-[#1a4d3e]"
                    />
                    <label
                      htmlFor="inStock"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      In Stock Only
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategories([])
                    setShowInStockOnly(false)
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <Card className="p-12 text-center bg-white">
                  <p className="text-muted-foreground">No products found matching your filters.</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
