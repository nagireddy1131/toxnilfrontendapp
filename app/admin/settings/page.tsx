"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "Toxnil Pharmaceuticals",
    supportEmail: "support@toxnil.com",
    taxRate: 8,
    freeShippingThreshold: 500,
    shippingCostPerKm: 1,
    shippingDistanceRange: 10
  })
  const { toast } = useToast()

  useEffect(() => {
    const savedSettings = localStorage.getItem("storeSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleSave = () => {
    localStorage.setItem("storeSettings", JSON.stringify(settings))
    toast({ title: "Settings saved successfully" })
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-emerald-950">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input name="storeName" value={settings.storeName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input name="supportEmail" value={settings.supportEmail} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Minimum Order for Free Shipping (₹)</Label>
              <Input type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Shipping Distance Range (km)</Label>
              <Input type="number" name="shippingDistanceRange" value={settings.shippingDistanceRange} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Shipping Cost per Range (₹)</Label>
              <Input type="number" name="shippingCostPerKm" value={settings.shippingCostPerKm} onChange={handleChange} />
            </div>
          </div>
          
          <Button onClick={handleSave} className="bg-emerald-700 hover:bg-emerald-800">
            <Save className="h-4 w-4 mr-2" /> Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
