"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2, UploadCloud } from "lucide-react"
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

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [saving, setSaving] = useState(false)
  const [customCategory, setCustomCategory] = useState(false)
  const [formData, setFormData] = useState({
    name: "", price: 0, image: "", gallery: [] as string[], brand: "TOXNIL", category: "", 
    countInStock: 0, description: "", sku: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === "price" || name === "countInStock" ? Number(value) : value }))
  }

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...formData.gallery]
    newGallery[index] = value
    setFormData(prev => ({ ...prev, gallery: newGallery }))
  }

  const addGalleryImage = () => {
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ""] }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))
  }

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
      const base64String = await compressImage(file)
      if (isGallery && index >= 0) {
        handleGalleryChange(index, base64String)
      } else {
        setFormData(prev => ({ ...prev, image: base64String }))
      }
    } catch {
      toast({ title: 'Image processing failed', variant: 'destructive' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Filter out empty gallery strings before sending
      const payload = { ...formData, gallery: formData.gallery.filter(url => url.trim() !== "") }
      await api.post(`/products`, payload)
      toast({ title: "Product created successfully" })
      router.push("/admin/products")
    } catch (error: any) {
      toast({ title: "Failed to create product", description: error.response?.data?.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-3xl font-bold text-emerald-950">Add New Product</h1>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Product Title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU / ID</Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. TOX-001" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countInStock">Initial Stock Quantity</Label>
              <Input id="countInStock" name="countInStock" type="number" min="0" value={formData.countInStock} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {customCategory ? (
                <div className="flex gap-2">
                  <Input 
                    id="category" name="category" value={formData.category} 
                    onChange={handleChange} required placeholder="Enter custom category" 
                  />
                  <Button type="button" variant="outline" onClick={() => {
                    setCustomCategory(false)
                    setFormData(prev => ({...prev, category: ""}))
                  }}>Select</Button>
                </div>
              ) : (
                <Select value={formData.category} onValueChange={(val) => {
                  if (val === "Other") {
                    setCustomCategory(true)
                    setFormData(prev => ({...prev, category: ""}))
                  } else {
                    setFormData(prev => ({...prev, category: val}))
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    <SelectItem value="Other">Other (Custom)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-4 border p-4 rounded-lg bg-muted/10">
            <Label>Main Product Image</Label>
            <div className="flex gap-2 mb-2">
              <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="Main image URL or Base64" className="flex-1" />
              <div className="relative">
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                <Button type="button" variant="outline"><UploadCloud className="h-4 w-4 mr-2" /> Upload</Button>
              </div>
            </div>
            {formData.image && (
              <div className="mt-2 h-32 w-32 border rounded-lg overflow-hidden bg-white">
                <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
            
            <div className="pt-4 border-t mt-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Additional Gallery Images</Label>
                <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>Add Image Row</Button>
              </div>
              <div className="space-y-3">
                {formData.gallery.map((url, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input 
                      value={url} 
                      onChange={(e) => handleGalleryChange(i, e.target.value)} 
                      placeholder="Additional image URL" 
                      className="flex-1"
                    />
                    <div className="relative">
                      <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true, i)} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                      <Button type="button" variant="outline" size="icon"><UploadCloud className="h-4 w-4" /></Button>
                    </div>
                    {url && (
                      <img src={url} alt="Gal" className="h-10 w-10 border rounded object-cover" />
                    )}
                    <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeGalleryImage(i)}>Remove</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={5} value={formData.description} onChange={handleChange} required placeholder="Product features and benefits..." />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/admin/products">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800" disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : <><Save className="h-4 w-4 mr-2" /> Create Product</>}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
