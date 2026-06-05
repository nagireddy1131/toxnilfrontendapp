"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Eye, Trash2, ArrowUpDown } from "lucide-react"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("salesCount") // default top selling
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { toast } = useToast()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/products?limit=100`)
      setProducts(data.products || data)
    } catch (e) {
      toast({ title: "Failed to load products", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`)
      toast({ title: "Product deleted successfully" })
      fetchProducts()
    } catch (e) {
      toast({ title: "Failed to delete product", variant: "destructive" })
    }
  }

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  let filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (categoryFilter !== "all") {
    filtered = filtered.filter(p => p.category === categoryFilter)
  }

  filtered.sort((a, b) => {
    if (sortBy === "salesCount") return (b.salesCount || 0) - (a.salesCount || 0)
    if (sortBy === "priceHigh") return b.price - a.price
    if (sortBy === "priceLow") return a.price - b.price
    if (sortBy === "stockLow") return a.countInStock - b.countInStock
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h1 className="text-3xl font-bold text-emerald-950">Products</h1>
        <Link href="/admin/products/new">
          <Button className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="h-4 w-4 mr-2" /> Add New Product
          </Button>
        </Link>
      </div>

      <Card className="p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or SKU..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c as string} value={c as string}>{c as string}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salesCount">Top Selling</SelectItem>
              <SelectItem value="priceHigh">Price: High to Low</SelectItem>
              <SelectItem value="priceLow">Price: Low to High</SelectItem>
              <SelectItem value="stockLow">Lowest Stock First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">Sales</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white border rounded overflow-hidden">
                          <img src={p.image || "/placeholder.svg"} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-medium text-emerald-950">{p.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {p.sku || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-emerald-800">{p.category}</td>
                    <td className="py-3 px-4 font-medium">₹{p.price}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.countInStock <= 5 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {p.countInStock}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-700">{p.salesCount || 0}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/products/${p._id}`}>
                          <Button variant="ghost" size="icon" title="View & Edit">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Delete">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product "{p.name}" and remove its data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProduct(p._id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
