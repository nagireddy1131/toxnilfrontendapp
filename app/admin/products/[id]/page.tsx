"use client"

import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Save, Loader2, UploadCloud, Edit2, X, Package,
  Tag, DollarSign, Layers, Star, Eye, BarChart2, CheckCircle, XCircle
} from "lucide-react"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PREDEFINED_CATEGORIES = [
  "Anti-Inflammatory",
  "Heart Health",
  "Daily Wellness",
  "Immunity",
  "Energy",
  "Sleep & Relaxation",
  "Digestive Health",
]

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  gallery: string[]
  brand: string
  category: string
  countInStock: number
  inStock: boolean
  description: string
  fullDescription?: string
  sku?: string
  rating: number
  reviewCount: number
  salesCount: number
  viewCount: number
  benefits?: string[]
  dosage?: string
  ingredients?: string
  isFeatured?: boolean
  createdAt?: string
}

export default function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [customCategory, setCustomCategory] = useState(false)
  const [formData, setFormData] = useState({
    name: "", price: 0, originalPrice: 0, discount: 0, image: "",
    gallery: [] as string[], brand: "", category: "",
    countInStock: 0, description: "", fullDescription: "", sku: "",
    benefits: [] as string[], dosage: "", ingredients: "", isFeatured: false,
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${resolvedParams.id}`)
        setProduct(data)
        setFormData({
          name: data.name || "",
          price: data.price || 0,
          originalPrice: data.originalPrice || 0,
          discount: data.discount || 0,
          image: data.image || "",
          gallery: data.gallery || [],
          brand: data.brand || "",
          category: data.category || "",
          countInStock: data.countInStock || 0,
          description: data.description || "",
          fullDescription: data.fullDescription || "",
          sku: data.sku || "",
          benefits: data.benefits || [],
          dosage: data.dosage || "",
          ingredients: data.ingredients || "",
          isFeatured: data.isFeatured || false,
        })
        if (data.category && !PREDEFINED_CATEGORIES.includes(data.category)) {
          setCustomCategory(true)
        }
      } catch (e) {
        toast({ title: "Failed to load product", variant: "destructive" })
        router.push("/admin/products")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [resolvedParams.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const numFields = ["price", "originalPrice", "discount", "countInStock"]
    setFormData(prev => ({ ...prev, [name]: numFields.includes(name) ? Number(value) : value }))
  }

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...formData.gallery]
    newGallery[index] = value
    setFormData(prev => ({ ...prev, gallery: newGallery }))
  }

  const addGalleryImage = () => setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ""] }))
  const removeGalleryImage = (index: number) =>
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))

  const compressImage = (file: File, maxSize = 1200, quality = 0.82): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(img.width * scale)
          canvas.height = Math.round(img.height * scale)
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.onerror = reject
        img.src = ev.target!.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false, index = -1) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const b64 = await compressImage(file)
      if (isGallery && index >= 0) handleGalleryChange(index, b64)
      else setFormData(prev => ({ ...prev, image: b64 }))
    } catch {
      toast({ title: 'Image processing failed', variant: 'destructive' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...formData, gallery: formData.gallery.filter(url => url.trim() !== "") }
      const { data } = await api.put(`/products/${resolvedParams.id}`, payload)
      setProduct(data)
      setIsEditing(false)
      toast({ title: "✅ Product updated successfully" })
    } catch (error: any) {
      toast({ title: "Update failed", description: error.response?.data?.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-12 w-12 text-emerald-700 mx-auto" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) return null

  // ─── VIEW MODE ───────────────────────────────────────────────────────────────
  if (!isEditing) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/products">
              <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-emerald-950">{product.name}</h1>
              <p className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</p>
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)} className="bg-emerald-700 hover:bg-emerald-800">
            <Edit2 className="h-4 w-4 mr-2" /> Edit Product
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Price", value: `₹${product.price}`, icon: DollarSign, color: "text-emerald-700" },
            { label: "In Stock", value: product.countInStock, icon: Layers, color: product.countInStock > 5 ? "text-emerald-700" : "text-red-600" },
            { label: "Sales", value: product.salesCount || 0, icon: BarChart2, color: "text-blue-600" },
            { label: "Views", value: product.viewCount || 0, icon: Eye, color: "text-purple-600" },
          ].map(stat => (
            <Card key={stat.label} className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Image */}
          <Card className="p-4 space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-100">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.gallery && product.gallery.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Gallery ({product.gallery.length} images)</p>
                <div className="flex gap-2 flex-wrap">
                  {product.gallery.map((img, i) => (
                    <div key={i} className="h-16 w-16 rounded-lg overflow-hidden border bg-white">
                      <img src={img} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Right: Info */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-lg text-emerald-900 border-b pb-2">Product Info</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Brand</p>
                  <p className="font-medium">{product.brand || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Selling Price</p>
                  <p className="font-bold text-emerald-700">₹{product.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Original Price</p>
                  <p className="font-medium line-through text-muted-foreground">₹{product.originalPrice || product.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Discount</p>
                  <p className="font-medium text-red-600">{product.discount || 0}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1 mt-1">
                    {product.inStock
                      ? <><CheckCircle className="h-4 w-4 text-emerald-600" /><span className="text-emerald-700 font-medium text-sm">In Stock</span></>
                      : <><XCircle className="h-4 w-4 text-red-500" /><span className="text-red-600 font-medium text-sm">Out of Stock</span></>
                    }
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating || 0} ({product.reviewCount || 0} reviews)</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Featured</p>
                  <p className="font-medium">{product.isFeatured ? "✅ Yes" : "No"}</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-2">
              <h2 className="font-semibold text-emerald-900 border-b pb-2">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              {product.fullDescription && (
                <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t">{product.fullDescription}</p>
              )}
            </Card>

            {product.benefits && product.benefits.length > 0 && (
              <Card className="p-5 space-y-2">
                <h2 className="font-semibold text-emerald-900 border-b pb-2">Benefits</h2>
                <ul className="space-y-1">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>

        {/* Dosage & Ingredients */}
        {(product.dosage || product.ingredients) && (
          <div className="grid md:grid-cols-2 gap-4">
            {product.dosage && (
              <Card className="p-5">
                <h2 className="font-semibold text-emerald-900 mb-2">Dosage & Usage</h2>
                <p className="text-sm text-muted-foreground">{product.dosage}</p>
              </Card>
            )}
            {product.ingredients && (
              <Card className="p-5">
                <h2 className="font-semibold text-emerald-900 mb-2">Ingredients</h2>
                <p className="text-sm text-muted-foreground">{product.ingredients}</p>
              </Card>
            )}
          </div>
        )}
      </div>
    )
  }

  // ─── EDIT MODE ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-emerald-950">Editing: {product.name}</h1>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU / ID</Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. TOX-001" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (₹)</Label>
              <Input id="originalPrice" name="originalPrice" type="number" min="0" value={formData.originalPrice} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" name="discount" type="number" min="0" max="100" value={formData.discount} onChange={handleChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="countInStock">Stock Quantity</Label>
              <Input id="countInStock" name="countInStock" type="number" min="0" value={formData.countInStock} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            {customCategory ? (
              <div className="flex gap-2">
                <Input name="category" value={formData.category} onChange={handleChange} required placeholder="Enter custom category" />
                <Button type="button" variant="outline" onClick={() => { setCustomCategory(false); setFormData(prev => ({ ...prev, category: "" })) }}>Select from list</Button>
              </div>
            ) : (
              <Select value={formData.category} onValueChange={(val) => {
                if (val === "Other") { setCustomCategory(true); setFormData(prev => ({ ...prev, category: "" })) }
                else setFormData(prev => ({ ...prev, category: val }))
              }}>
                <SelectTrigger><SelectValue placeholder="Select a Category" /></SelectTrigger>
                <SelectContent>
                  {PREDEFINED_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  <SelectItem value="Other">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Images */}
          <div className="space-y-4 border p-4 rounded-lg bg-muted/10">
            <Label>Main Product Image</Label>
            <div className="flex gap-2">
              <Input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL or upload file" className="flex-1" />
              <div className="relative">
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                <Button type="button" variant="outline"><UploadCloud className="h-4 w-4 mr-2" /> Upload</Button>
              </div>
            </div>
            {formData.image && (
              <div className="h-28 w-28 border rounded-lg overflow-hidden bg-white">
                <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <Label>Gallery Images</Label>
                <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>Add Image Row</Button>
              </div>
              <div className="space-y-3">
                {formData.gallery.map((url, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input value={url} onChange={(e) => handleGalleryChange(i, e.target.value)} placeholder="Image URL" className="flex-1" />
                    <div className="relative">
                      <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true, i)} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                      <Button type="button" variant="outline" size="icon"><UploadCloud className="h-4 w-4" /></Button>
                    </div>
                    {url && <img src={url} alt="" className="h-10 w-10 border rounded object-cover" />}
                    <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeGalleryImage(i)}>Remove</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea id="fullDescription" name="fullDescription" rows={4} value={formData.fullDescription} onChange={handleChange} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage & Usage</Label>
              <Textarea id="dosage" name="dosage" rows={2} value={formData.dosage} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea id="ingredients" name="ingredients" rows={2} value={formData.ingredients} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800" disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
