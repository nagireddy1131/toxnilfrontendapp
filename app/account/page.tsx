"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User, Package, Heart, MapPin, Settings, Truck,
  CheckCircle, Clock, Edit2, Trash2, Plus, LogOut,
  Loader2, Check, Activity, ShieldCheck, ArrowRight, Sparkles
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { HealthQuizModal } from "@/components/health-quiz-modal"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const GOAL_META: Record<string, { emoji: string; color: string }> = {
  "Heart Health":      { emoji: "❤️",  color: "bg-rose-100 text-rose-700 border-rose-200" },
  "Sleep & Relaxation":{ emoji: "🧠",  color: "bg-violet-100 text-violet-700 border-violet-200" },
  "Energy":            { emoji: "⚡",  color: "bg-amber-100 text-amber-700 border-amber-200" },
  "Immunity":          { emoji: "🛡️", color: "bg-orange-100 text-orange-700 border-orange-200" },
  "Anti-Inflammatory": { emoji: "🦴",  color: "bg-sky-100 text-sky-700 border-sky-200" },
  "Digestive Health":  { emoji: "🌱",  color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState({ name: "", email: "", phone: "", memberSince: "" })
  const [orders, setOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [healthGoals, setHealthGoals] = useState<string[]>([])
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [quizKey, setQuizKey] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if URL has ?tab=orders
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get("tab")
      if (tab) setActiveTab(tab)
    }
  }, [])
  
  // Settings forms
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" })
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [updatingPassword, setUpdatingPassword] = useState(false)

  // Address forms
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState({
    label: "Home", fullName: "", phone: "", address: "", city: "", state: "", postalCode: ""
  })
  
  const { toast } = useToast()

  const fetchData = async () => {
    const storedUser = localStorage.getItem("userInfo")
    if (!storedUser) {
      window.location.href = "/login"
      return
    }

    const userInfo = JSON.parse(storedUser)

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }

      // Fetch User Profile
      const { data: userProfile } = await api.get('/users/profile', config)
      setUser({
        name: userProfile.name,
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        memberSince: new Date(userProfile.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      })
      setProfileForm({
        name: userProfile.name,
        email: userProfile.email || "",
        phone: userProfile.phone || ""
      })

      // Fetch My Orders
      const { data: myOrders } = await api.get('/orders/myorders', config)
      setOrders(myOrders)

      // Fetch Addresses
      const { data: myAddresses } = await api.get('/users/addresses', config)
      setAddresses(myAddresses || [])

      // Fetch Health Goals
      try {
        const { data: goalsData } = await api.get('/users/health-goals', config)
        setHealthGoals(goalsData.healthGoals || [])
        if (goalsData.healthGoals?.length > 0) {
          localStorage.setItem('healthGoals', JSON.stringify(goalsData.healthGoals))
          localStorage.setItem('healthGoalsSet', 'true')
        }
      } catch { /* non-critical */ }

    } catch (error) {
      toast({ title: "Error", description: "Failed to load account information", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- Profile Updates ---
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdatingProfile(true)
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
      const { data } = await api.put('/users/profile', profileForm, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      })
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, name: data.name }))
      setUser(prev => ({ ...prev, name: data.name, email: data.email, phone: data.phone }))
      toast({ title: "Profile updated successfully" })
    } catch (error: any) {
      toast({ title: "Update failed", description: error.response?.data?.message, variant: "destructive" })
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast({ title: "Passwords do not match", variant: "destructive" })
    }
    setUpdatingPassword(true)
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
      await api.put('/users/profile', { password: passwordForm.newPassword }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      })
      toast({ title: "Password updated successfully" })
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      toast({ title: "Update failed", description: error.response?.data?.message, variant: "destructive" })
    } finally {
      setUpdatingPassword(false)
    }
  }

  // --- Address Management ---
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
      
      if (editingAddressId) {
        await api.put(`/users/addresses/${editingAddressId}`, addressForm, config)
        toast({ title: "Address updated" })
      } else {
        await api.post('/users/addresses', addressForm, config)
        toast({ title: "Address added" })
      }
      
      setShowAddressForm(false)
      setEditingAddressId(null)
      fetchData() // Refresh list
    } catch (error: any) {
      toast({ title: "Failed to save address", description: error.response?.data?.message, variant: "destructive" })
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
      await api.delete(`/users/addresses/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      })
      toast({ title: "Address deleted" })
      fetchData()
    } catch (error) {
      toast({ title: "Delete failed", variant: "destructive" })
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
      await api.put(`/users/addresses/${id}/default`, {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      })
      toast({ title: "Default address updated" })
      fetchData()
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" })
    }
  }

  const openEditAddress = (addr: any) => {
    setAddressForm({
      label: addr.label, fullName: addr.fullName, phone: addr.phone || "",
      address: addr.address, city: addr.city, state: addr.state || "", postalCode: addr.postalCode
    })
    setEditingAddressId(addr._id)
    setShowAddressForm(true)
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-700" />
      </div>
    )
  }

  return (
    <>
    <div className="min-h-screen bg-[#F5F3F0]">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1a4d3e] font-playfair">My Account</h1>
            <p className="text-muted-foreground">Manage your orders, addresses, and preferences</p>
          </div>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              localStorage.removeItem("userInfo")
              window.location.href = "/"
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="p-3 flex flex-col gap-1 sticky top-24">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "overview" ? "bg-[#1a4d3e] text-white" : "text-gray-600 hover:bg-emerald-50 hover:text-[#1a4d3e]"
                }`}
              >
                <User className="h-4 w-4 mr-3" /> Overview
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "orders" ? "bg-[#1a4d3e] text-white" : "text-gray-600 hover:bg-emerald-50 hover:text-[#1a4d3e]"
                }`}
              >
                <Package className="h-4 w-4 mr-3" /> My Orders
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "addresses" ? "bg-[#1a4d3e] text-white" : "text-gray-600 hover:bg-emerald-50 hover:text-[#1a4d3e]"
                }`}
              >
                <MapPin className="h-4 w-4 mr-3" /> Addresses
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "settings" ? "bg-[#1a4d3e] text-white" : "text-gray-600 hover:bg-emerald-50 hover:text-[#1a4d3e]"
                }`}
              >
                <Settings className="h-4 w-4 mr-3" /> Settings
              </button>
              <button
                onClick={() => setActiveTab("health")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "health" ? "bg-[#1a4d3e] text-white" : "text-gray-600 hover:bg-emerald-50 hover:text-[#1a4d3e]"
                }`}
              >
                <Heart className="h-4 w-4 mr-3" /> My Health
              </button>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Overview Section */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-[#1a4d3e] to-[#2d6a5a] text-white border-0 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <User className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold uppercase backdrop-blur-sm shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl">{user.name}</h3>
                        <p className="text-emerald-100">{user.email || user.phone}</p>
                      </div>
                    </div>
                    <p className="relative z-10 text-emerald-100/80 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Member since {user.memberSince}
                    </p>
                  </Card>

                  <Card className="p-6 border-0 shadow-md">
                    <h3 className="font-semibold text-[#1a4d3e] mb-5 flex items-center gap-2">
                      <Activity className="w-5 h-5" /> Account Summary
                    </h3>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-500 flex items-center gap-2"><Package className="w-4 h-4" /> Total Orders</span>
                        <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{orders.length}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Saved Addresses</span>
                        <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{addresses.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Delivered Orders</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">{orders.filter(o => o.status === 'delivered').length}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recent Orders in Overview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                    {orders.length > 0 && (
                      <button onClick={() => setActiveTab("orders")} className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {orders.length === 0 ? (
                    <Card className="p-8 text-center border-dashed bg-white/50">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                      <Button asChild className="mt-4 bg-[#1a4d3e] hover:bg-[#1a4d3e]/90">
                        <Link href="/products">Shop Products</Link>
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {orders.slice(0, 3).map((order) => (
                        <Card key={order._id} className="p-5 border-0 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Order #{order._id.substring(order._id.length - 6)}</p>
                              <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                            <div className="text-left sm:text-right">
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="font-bold text-[#1a4d3e]">₹{order.totalPrice.toFixed(2)}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                              ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                order.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                              <span className="capitalize">{order.status.replace(/_/g, ' ')}</span>
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <Card className="p-0 overflow-hidden border-0 shadow-md">
                  <div className="p-6 border-b bg-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#1a4d3e]" />
                    <h2 className="text-xl font-semibold text-[#1a4d3e]">Order History & Tracking</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                      <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
                        <Package className="w-16 h-16 text-gray-200 mb-4" />
                        <p className="text-lg">You haven't placed any orders yet.</p>
                        <Button asChild className="mt-6 bg-[#1a4d3e] hover:bg-[#1a4d3e]/90">
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order._id} className="p-6 bg-white hover:bg-gray-50/50 transition-colors">
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order ID</p>
                              <p className="text-sm font-medium text-gray-900">{order._id}</p>
                              <p className="text-sm text-gray-500 mt-1">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="text-right">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium shadow-sm
                                ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                  order.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                                  'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                {order.status === 'delivered' ? <CheckCircle className="h-4 w-4" /> :
                                 order.status === 'out_for_delivery' ? <Truck className="h-4 w-4" /> :
                                 order.status === 'shipped' ? <Truck className="h-4 w-4" /> :
                                 <Clock className="h-4 w-4" />}
                                <span className="capitalize">{order.status.replace(/_/g, ' ')}</span>
                              </span>

                              {/* OTP Notification for Out for Delivery */}
                              {order.status === 'out_for_delivery' && (
                                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200 text-left max-w-xs ml-auto shadow-sm">
                                  <p className="text-sm font-bold text-purple-900 mb-1 flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Delivery OTP Sent</p>
                                  <p className="text-xs text-purple-700 leading-relaxed">Check your email. Provide the 6-digit OTP to the delivery executive to confirm receipt.</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2"><Package className="w-4 h-4 text-gray-400"/> Items</h4>
                              <div className="space-y-3">
                                {order.orderItems.map((item: any, i: number) => (
                                  <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm p-2 rounded-lg">
                                    <div className="w-14 h-14 bg-gray-50 rounded flex items-center justify-center p-1">
                                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain rounded" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.qty} × ₹{item.price}</p>
                                    </div>
                                    <div className="pr-3 font-bold text-[#1a4d3e]">
                                      ₹{(item.qty * item.price).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                                  <span className="font-medium text-gray-600">Total Paid</span>
                                  <span className="text-lg font-bold text-[#1a4d3e]">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Order Tracking Timeline */}
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2"><Truck className="w-4 h-4 text-gray-400"/> Tracking History</h4>
                              <div className="space-y-4 pl-3">
                                {order.statusHistory?.map((history: any, index: number) => (
                                  <div key={index} className="relative pl-6 pb-4 border-l-2 border-emerald-200 last:border-0 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                                    <div className="-mt-1.5 bg-white border border-gray-100 shadow-sm rounded-lg p-3">
                                      <p className="text-sm font-semibold text-gray-900 capitalize flex items-center gap-2">
                                        {history.status.replace(/_/g, ' ')}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(history.timestamp).toLocaleString()}</p>
                                      {history.note && <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded border border-gray-100">{history.note}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-[#1a4d3e]">Saved Addresses</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage where your wellness products are delivered.</p>
                  </div>
                  <Button onClick={() => {
                    setAddressForm({ label: "Home", fullName: "", phone: "", address: "", city: "", state: "", postalCode: "" })
                    setEditingAddressId(null)
                    setShowAddressForm(true)
                  }} className="bg-[#1a4d3e] hover:bg-[#2d6a5a] shadow-md hover:shadow-lg transition-all">
                    <Plus className="h-4 w-4 mr-2" /> Add New Address
                  </Button>
                </div>

                {showAddressForm && (
                  <Card className="p-6 mb-6 border-emerald-200 bg-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <h3 className="font-bold text-lg mb-4">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                    <form onSubmit={handleAddressSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Label (Home, Office)</Label>
                          <Input className="bg-gray-50" value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} required placeholder="e.g. Home" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</Label>
                          <Input className="bg-gray-50" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Street Address</Label>
                          <Input className="bg-gray-50" value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">City</Label>
                          <Input className="bg-gray-50" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">State</Label>
                          <Input className="bg-gray-50" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">PIN / Postal Code</Label>
                          <Input className="bg-gray-50" value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</Label>
                          <Input className="bg-gray-50" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} required />
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                        <Button type="submit" className="bg-[#1a4d3e]">{editingAddressId ? 'Update' : 'Save'} Address</Button>
                      </div>
                    </form>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <Card key={addr._id} className={`p-6 relative border-0 shadow-sm hover:shadow-md transition-shadow bg-white ${addr.isDefault ? 'ring-2 ring-[#1a4d3e]' : 'ring-1 ring-gray-200'}`}>
                      {addr.isDefault && (
                        <span className="absolute top-0 right-0 bg-[#1a4d3e] text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-bold tracking-wide flex items-center gap-1">
                          <Check className="w-3 h-3"/> DEFAULT
                        </span>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-[#1a4d3e]">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 text-lg">{addr.label}</h4>
                          </div>
                          <p className="font-medium text-gray-700 mb-2">{addr.fullName}</p>
                          <p className="text-gray-500 text-sm leading-relaxed">{addr.address}</p>
                          <p className="text-gray-500 text-sm">{addr.city}, {addr.state} {addr.postalCode}</p>
                          <p className="text-gray-500 text-sm mt-2 flex items-center gap-1"><Phone className="w-3 h-3"/> {addr.phone}</p>
                          
                          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                            <button onClick={() => openEditAddress(addr)} className="text-sm text-emerald-700 font-semibold hover:text-emerald-900 flex items-center transition-colors">
                              <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
                            </button>
                            <button onClick={() => handleDeleteAddress(addr._id)} className="text-sm text-red-500 font-semibold hover:text-red-700 flex items-center transition-colors">
                              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                            </button>
                            {!addr.isDefault && (
                              <button onClick={() => handleSetDefaultAddress(addr._id)} className="text-sm text-gray-500 font-semibold hover:text-gray-900 flex items-center transition-colors ml-auto">
                                Set as Default
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {addresses.length === 0 && !showAddressForm && (
                    <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No Saved Addresses</h3>
                      <p className="text-gray-500 max-w-sm mx-auto">Add an address to make your next checkout faster and easier.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <Card className="p-8 border-0 shadow-md">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <User className="w-6 h-6 text-[#1a4d3e]" />
                    <h3 className="text-xl font-semibold text-[#1a4d3e]">Profile Information</h3>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-lg">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</Label>
                      <Input className="bg-gray-50 focus:bg-white transition-colors" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</Label>
                      <Input className="bg-gray-50 focus:bg-white transition-colors" type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</Label>
                      <Input className="bg-gray-50 focus:bg-white transition-colors" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} required />
                    </div>
                    <Button type="submit" disabled={updatingProfile} className="bg-[#1a4d3e] hover:bg-[#2d6a5a] w-full sm:w-auto mt-4">
                      {updatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Profile Changes
                    </Button>
                  </form>
                </Card>

                <Card className="p-8 border-0 shadow-md">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <ShieldCheck className="w-6 h-6 text-[#1a4d3e]" />
                    <h3 className="text-xl font-semibold text-[#1a4d3e]">Change Password</h3>
                  </div>
                  <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-lg">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">New Password</Label>
                      <Input className="bg-gray-50 focus:bg-white transition-colors" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} required minLength={6} placeholder="Minimum 6 characters" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Confirm New Password</Label>
                      <Input className="bg-gray-50 focus:bg-white transition-colors" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required minLength={6} placeholder="Type password again" />
                    </div>
                    <Button type="submit" disabled={updatingPassword} className="bg-[#1a4d3e] hover:bg-[#2d6a5a] w-full sm:w-auto mt-4">
                      {updatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Password
                    </Button>
                  </form>
                </Card>
              </div>
            )}
          </div>

          {/* Health Tab */}
          {activeTab === "health" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <Card className="p-8 border-0 shadow-md">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-[#1a4d3e]" />
                    <h3 className="text-xl font-semibold text-[#1a4d3e]">My Health Goals</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white"
                    onClick={() => { setQuizKey(k => k + 1); setShowQuizModal(true) }}
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                    {healthGoals.length === 0 ? 'Take Health Quiz' : 'Edit Goals'}
                  </Button>
                </div>
                {healthGoals.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4">🎯</div>
                    <p className="text-gray-500 mb-2 font-medium">No health goals set yet.</p>
                    <p className="text-sm text-gray-400">Take our quick quiz to get personalised product recommendations!</p>
                    <Button
                      className="mt-6 bg-[#1a4d3e] hover:bg-[#2d6a5a]"
                      onClick={() => { setQuizKey(k => k + 1); setShowQuizModal(true) }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Take the Health Quiz
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mb-5">You're working on improving these areas. We'll show you the best products for each.</p>
                    <div className="flex flex-wrap gap-3">
                      {healthGoals.map((goal) => {
                        const meta = GOAL_META[goal] || { emoji: '🌿', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
                        return (
                          <div key={goal} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold ${meta.color}`}>
                            <span>{meta.emoji}</span>
                            <span>{goal}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <Link href={`/products?category=${encodeURIComponent(healthGoals[0] || '')}`}>
                        <Button className="bg-[#1a4d3e] hover:bg-[#2d6a5a]">
                          View My Recommended Products <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Health Quiz Modal re-open from account page */}
    {showQuizModal && (
      <HealthQuizModal
        key={quizKey}
        onClose={() => {
          setShowQuizModal(false)
          const saved = localStorage.getItem('healthGoals')
          if (saved) setHealthGoals(JSON.parse(saved))
        }}
      />
    )}
    </>
  )
}
