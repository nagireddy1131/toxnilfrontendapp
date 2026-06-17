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
import { categories } from "@/lib/data"
import api from "@/lib/api"
import { Product } from "@/components/product-card"
import { SlidersHorizontal, X } from "lucide-react"

function ProductsContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (!categoryParam) return []
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

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setShowInStockOnly(false)
  }

  // Reusable filter panel content
  const FilterPanel = () => (
    <div className="space-y-6">
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
              id={`cat-${category}`}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
              className="border-[#1a4d3e] data-[state=checked]:bg-[#1a4d3e]"
            />
            <label
              htmlFor={`cat-${category}`}
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {category}
            </label>
          </div>
        ))}
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <Label>Availability</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={showInStockOnly}
            onCheckedChange={(checked) => setShowInStockOnly(checked as boolean)}
            className="border-[#1a4d3e] data-[state=checked]:bg-[#1a4d3e]"
          />
          <label htmlFor="inStock" className="text-sm font-medium leading-none cursor-pointer">
            In Stock Only
          </label>
        </div>
      </div>

      {/* Clear */}
      <Button
        variant="outline"
        className="w-full border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white bg-transparent"
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <SiteHeader />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-[#1a4d3e] to-[#2d6a5a] text-white py-10 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 font-playfair">Our Products</h1>
          <p className="text-sm md:text-lg text-white/80 max-w-2xl">
            Discover our complete range of nano-enhanced wellness supplements, designed for maximum absorption and effectiveness.
          </p>
        </div>
      </section>

      {/* Products Grid with Filters */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4">

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} of {products.length} products
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-[#1a4d3e] text-[#1a4d3e] flex items-center gap-2"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </Button>
          </div>

          {/* Mobile filter drawer overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-[200] flex">
              {/* Backdrop */}
              <div
                className="flex-1 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
              />
              {/* Drawer */}
              <div className="w-[85vw] max-w-sm bg-white h-full overflow-y-auto p-6 shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1a4d3e]">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterPanel />
                <Button
                  className="w-full mt-6 bg-[#1a4d3e] hover:bg-[#2d6a5a] text-white"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Show {filteredProducts.length} Results
                </Button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="p-6 sticky top-24 bg-white shadow-md border-0">
                <FilterPanel />
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="hidden lg:flex mb-6 items-center justify-between">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden bg-white animate-pulse">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <Card className="p-12 text-center bg-white">
                  <p className="text-muted-foreground text-sm md:text-base">No products found matching your filters.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-[#1a4d3e] text-[#1a4d3e]"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
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

