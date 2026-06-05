"use client"

import { useState, useEffect } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Lock, CheckCircle, MapPin, Truck, Loader2, ShoppingBag, ChevronRight, Home, Plus, CreditCard, Banknote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useCart } from "@/components/cart-provider"
import api from "@/lib/api"

export default function CheckoutPage() {
  const { items: cartItems, subtotal, clearCart } = useCart()
  const [step, setStep] = useState<"shipping" | "review">("shipping")
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay">("COD")
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", postalCode: "", country: "India"
  })
  const [shippingCost, setShippingCost] = useState(0)
  const [calculatingShipping, setCalculatingShipping] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const userInfoStr = localStorage.getItem("userInfo")
      if (!userInfoStr) {
        toast({ title: "Please login to checkout", variant: "destructive" })
        router.push("/login?redirect=/checkout"); return
      }
      try {
        const userInfo = JSON.parse(userInfoStr)
        const { data } = await api.get('/users/addresses', { headers: { Authorization: `Bearer ${userInfo.token}` } })
        setAddresses(data)
        const def = data.find((a: any) => a.isDefault) || data[0]
        if (def) { setSelectedAddressId(def._id); setShippingInfo(def) }
        else setShowNewForm(true)
      } catch (e) { setShowNewForm(true) }
      finally { setLoadingInitial(false) }
    }
    init()
  }, [])

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr._id)
    setShippingInfo(addr)
    setShowNewForm(false)
  }

  const calcShipping = async () => {
    if (subtotal >= 500) { setShippingCost(0); return }
    setCalculatingShipping(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(shippingInfo.city + ', ' + shippingInfo.state + ', India')}`)
      const data = await res.json()
      let cost = 40
      if (data?.length > 0) {
        const dLat = (parseFloat(data[0].lat) - 16.3067) * Math.PI / 180
        const dLon = (parseFloat(data[0].lon) - 80.4365) * Math.PI / 180
        const a = Math.sin(dLat/2)**2 + Math.cos(16.3067 * Math.PI/180) * Math.cos(parseFloat(data[0].lat) * Math.PI/180) * Math.sin(dLon/2)**2
        const dist = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        cost = Math.max(10, Math.ceil(dist / 10))
      }
      setShippingCost(cost)
    } catch { setShippingCost(40) }
    finally { setCalculatingShipping(false) }
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    await calcShipping()
    setStep("review")
  }

  const handlePlaceOrder = async () => {
    setPlacingOrder(true)
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
      const { data: order } = await api.post('/orders', {
        orderItems: cartItems.map(i => ({ name: i.name, qty: i.quantity, image: i.image || "/placeholder.svg", price: i.price, product: i.id })),
        shippingAddress: shippingInfo,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: shippingCost,
        totalPrice: subtotal + shippingCost
      }, { headers: { Authorization: `Bearer ${userInfo.token}` } })

      if (paymentMethod === "COD") {
        toast({ title: "🎉 Order placed!", description: `Order #${order._id.slice(-6).toUpperCase()} confirmed.` })
        clearCart()
        setTimeout(() => router.push("/account"), 1500)
        return
      }

      // Razorpay flow
      const { data: rzpData } = await api.post(`/orders/${order._id}/razorpay`, {}, { headers: { Authorization: `Bearer ${userInfo.token}` } })

      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: "Toxnil",
        description: `Order #${order._id.slice(-6).toUpperCase()}`,
        order_id: rzpData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await api.post(`/orders/${order._id}/razorpay/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, { headers: { Authorization: `Bearer ${userInfo.token}` } })
            toast({ title: "✅ Payment Successful!", description: `Order #${order._id.slice(-6).toUpperCase()} confirmed.` })
            clearCart()
            router.push("/account")
          } catch (err: any) {
            toast({ title: "Payment verification failed", description: err.response?.data?.message, variant: "destructive" })
          }
        },
        prefill: {
          name: shippingInfo.fullName,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: { color: "#1a4d3e" },
        modal: {
          ondismiss: () => {
            toast({ title: "Payment cancelled", description: "Your order is saved. Pay later from your account.", variant: "destructive" })
            setPlacingOrder(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
      // Don't setPlacingOrder(false) yet — modal is open
      return
    } catch (error: any) {
      toast({ title: "Order failed", description: error.response?.data?.message, variant: "destructive" })
    }
    setPlacingOrder(false)
  }

  if (loadingInitial) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div>

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-[#f0f4f0] flex items-center justify-center">
      <div className="text-center p-8">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <Link href="/products"><Button className="bg-emerald-700 mt-4">Continue Shopping</Button></Link>
      </div>
    </div>
  )

  const total = subtotal + shippingCost

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-[#f0f7f4] flex flex-col">
      <Toaster />

      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-emerald-700" />
              <span className="text-xl font-bold text-emerald-800">TOXNIL</span>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-emerald-700 font-medium">
            <Lock className="h-3.5 w-3.5" /> Secure Checkout
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 max-w-5xl">
          <div className="flex items-center gap-2 text-sm">
            <div className={`flex items-center gap-1.5 ${step === "shipping" ? "text-emerald-700 font-semibold" : "text-emerald-600"}`}>
              {step === "review" ? <CheckCircle className="h-4 w-4" /> : <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">1</span>}
              <span>Delivery Address</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center gap-1.5 ${step === "review" ? "text-emerald-700 font-semibold" : "text-gray-400"}`}>
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${step === "review" ? "bg-emerald-700 text-white" : "bg-gray-200 text-gray-500"}`}>2</span>
              <span>Review & Confirm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Main Area */}
          <div className="lg:col-span-3 space-y-5">
            {step === "shipping" ? (
              <>
                {/* Saved Addresses */}
                {addresses.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Home className="h-4 w-4 text-emerald-700" /> Saved Addresses
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {addresses.map(addr => (
                        <button
                          key={addr._id}
                          type="button"
                          onClick={() => handleSelectAddress(addr)}
                          className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedAddressId === addr._id && !showNewForm ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-gray-200 hover:border-emerald-300 bg-white'}`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{addr.label}</span>
                            {selectedAddressId === addr._id && !showNewForm && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                          </div>
                          <p className="font-semibold text-gray-900 mt-2 text-sm">{addr.fullName}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addr.address}, {addr.city}, {addr.state} {addr.postalCode}</p>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => { setShowNewForm(true); setSelectedAddressId("new") }}
                        className={`text-left p-4 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-1 ${showNewForm ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 bg-white'}`}
                      >
                        <Plus className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">Add New Address</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Address Form */}
                {(showNewForm || addresses.length === 0) && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-700" /> Delivery Details
                    </h2>
                    <form id="address-form" onSubmit={handleContinue} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name *</Label>
                          <Input className="mt-1 rounded-lg border-gray-200 focus:border-emerald-500" value={shippingInfo.fullName} onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})} placeholder="Your name" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone *</Label>
                          <Input className="mt-1 rounded-lg border-gray-200 focus:border-emerald-500" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} placeholder="10-digit number" required />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email Address * <span className="normal-case text-gray-400 font-normal">(OTP for delivery will be sent here)</span></Label>
                        <Input type="email" className="mt-1 rounded-lg border-gray-200 focus:border-emerald-500" value={shippingInfo.email} onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})} placeholder="your@email.com" required />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Street Address *</Label>
                        <Input className="mt-1 rounded-lg border-gray-200 focus:border-emerald-500" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} placeholder="House no, Street, Area" required />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">City *</Label>
                          <Input className="mt-1 rounded-lg border-gray-200 focus:border-emerald-500" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} placeholder="City" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">State *</Label>
                          <Input className="mt-1 rounded-lg border-gray-200 focus:border-emerald-500" value={shippingInfo.state} onChange={e => setShippingInfo({...shippingInfo, state: e.target.value})} placeholder="State" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">PIN Code *</Label>
                          <Input className="mt-1 rounded-lg border-gray-200 focus:border-emerald-500" value={shippingInfo.postalCode} onChange={e => setShippingInfo({...shippingInfo, postalCode: e.target.value})} placeholder="6-digit PIN" required />
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Shipping note */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <Truck className="h-5 w-5 text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Free Shipping on orders above ₹500</p>
                    <p className="text-xs text-emerald-700 mt-0.5">Orders below ₹500 are charged ₹1 per 10km from Guntur, Andhra Pradesh.</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="address-form"
                  onClick={showNewForm ? undefined : (e) => { e.preventDefault(); handleContinue(e as any) }}
                  disabled={calculatingShipping || (!shippingInfo.city && !selectedAddressId)}
                  className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-base font-semibold shadow-md"
                >
                  {calculatingShipping
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating shipping…</>
                    : <><span>Continue to Review</span> <ChevronRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </>
            ) : (
              <>
                {/* Review Step */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-700" /> Delivering to
                    </h2>
                    <button onClick={() => setStep("shipping")} className="text-sm text-blue-600 font-medium hover:underline">Change</button>
                  </div>
                  <div className="flex gap-3 bg-gray-50 p-4 rounded-xl border">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Home className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{shippingInfo.fullName}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} — {shippingInfo.postalCode}</p>
                      <p className="text-xs text-emerald-700 font-medium mt-1">📞 {shippingInfo.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-emerald-700" /> Order Items ({cartItems.length})
                  </h2>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-white border" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-emerald-700 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-700" /> Payment Method
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === "COD" ? "border-emerald-600 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <Banknote className="h-6 w-6 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when you receive</p>
                      </div>
                      {paymentMethod === "COD" && <CheckCircle className="h-4 w-4 text-emerald-600 ml-auto" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Razorpay")}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === "Razorpay" ? "border-emerald-600 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <CreditCard className="h-6 w-6 text-indigo-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Pay Online</p>
                        <p className="text-xs text-gray-500">UPI, Cards, Wallets via Razorpay</p>
                      </div>
                      {paymentMethod === "Razorpay" && <CheckCircle className="h-4 w-4 text-emerald-600 ml-auto" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-base font-semibold shadow-md"
                >
                  {placingOrder
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
                    : paymentMethod === "Razorpay"
                      ? <><CreditCard className="mr-2 h-4 w-4" /> Pay ₹{total.toFixed(0)} Online</>
                      : "✅ Confirm & Place Order"
                  }
                </Button>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <p className="text-sm text-gray-700 flex-1 truncate">{item.name}</p>
                    <p className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {step === "review"
                    ? shippingCost === 0 ? <span className="text-emerald-600 font-semibold">Free ✨</span> : <span>₹{shippingCost}</span>
                    : <span className="text-gray-400 italic text-xs">calculated next</span>
                  }
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-emerald-700">₹{(subtotal + (step === "review" ? shippingCost : 0)).toFixed(0)}</span>
                </div>
              </div>

              {subtotal >= 500 && (
                <div className="mt-4 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg p-3 text-center">
                  ✨ You unlocked free shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-700" />
            <span className="font-semibold text-emerald-800">TOXNIL</span>
          </div>
          <p>© {new Date().getFullYear()} TOXNIL. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/faq" className="hover:text-emerald-700">Help</Link>
            <Link href="/contact" className="hover:text-emerald-700">Contact</Link>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
