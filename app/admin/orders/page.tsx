"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Eye, X, MapPin, Truck, Phone, Package, CheckCircle, Send, ShieldCheck, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({})
  const [sendingOtpFor, setSendingOtpFor] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      const { data } = await api.get(`/orders`)
      setOrders(data.orders || data)
    } catch (e) {
      toast({ title: "Failed to load orders", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status })
      toast({ title: "Status updated" })
      fetchOrders()
      if (selectedOrder?._id === id) setSelectedOrder((o: any) => ({ ...o, status }))
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.response?.data?.message, variant: "destructive" })
    }
  }

  const sendOtp = async (id: string) => {
    if (sendingOtpFor === id) return
    setSendingOtpFor(id)
    toast({ title: "📨 Sending OTP...", description: "Please wait, sending OTP to customer email.", duration: 3000 })
    try {
      const { data } = await api.post(`/orders/${id}/send-otp`)
      toast({ 
        title: data.otp ? "⚠️ OTP Generated (Email failed)" : "✅ OTP Sent!", 
        description: data.otp 
          ? `Email failed. OTP: ${data.otp} — relay to customer manually.` 
          : data.message,
        duration: 15000 
      })
      fetchOrders()
    } catch (e: any) {
      toast({ title: "Failed to send OTP", description: e.response?.data?.message, variant: "destructive" })
    } finally {
      setSendingOtpFor(null)
    }
  }

  const verifyOtp = async (id: string) => {
    const otp = otpInputs[id]
    if (!otp || otp.length < 6) return toast({ title: "Enter a valid 6-digit OTP", variant: "destructive" })
    try {
      await api.post(`/orders/${id}/verify-otp`, { otp })
      toast({ title: "✅ Delivery Confirmed!", description: "Order marked as delivered." })
      setOtpInputs(prev => { const n = { ...prev }; delete n[id]; return n })
      fetchOrders()
    } catch (e: any) {
      toast({ title: "Invalid OTP", description: e.response?.data?.message, variant: "destructive" })
    }
  }

  const statusColor = (s: string) =>
    s === 'pending' ? 'bg-yellow-100 text-yellow-800' :
    s === 'processing' ? 'bg-blue-100 text-blue-800' :
    s === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
    s === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
    s === 'delivered' ? 'bg-green-100 text-green-800' :
    'bg-red-100 text-red-800'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-950">Orders Management</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      <Card className="overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <>
                    <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-emerald-700">{o._id.slice(-8).toUpperCase()}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{o.shippingAddress?.fullName || o.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{o.shippingAddress?.phone || o.user?.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">₹{o.totalPrice?.toFixed(0)}</td>
                      <td className="py-3 px-4">
                        <Select key={o._id + o.status} value={o.status} onValueChange={(val) => updateStatus(o._id, val)}>
                          <SelectTrigger className={`w-[150px] h-7 text-xs font-semibold border-none ${statusColor(o.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(selectedOrder?._id === o._id ? null : o)} className="h-7 text-xs text-blue-600 hover:bg-blue-50">
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                      </td>
                    </tr>

                    {/* Inline OTP Row — shows only when status is out_for_delivery */}
                    {o.status === 'out_for_delivery' && (
                      <tr key={`${o._id}-otp`} className="bg-purple-50/60 border-t border-purple-100">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <Truck className="h-4 w-4 text-purple-600 shrink-0" />
                            <span className="text-xs font-semibold text-purple-900">Out for Delivery</span>
                            <Button
                              size="sm"
                              onClick={() => sendOtp(o._id)}
                              disabled={sendingOtpFor === o._id}
                              className="h-7 text-xs bg-purple-600 hover:bg-purple-700 gap-1 disabled:opacity-70"
                            >
                              {sendingOtpFor === o._id 
                                ? <><Loader2 className="h-3 w-3 animate-spin" /> Sending…</>
                                : <><Send className="h-3 w-3" /> {o.deliveryOtpSentAt ? "Resend OTP" : "Send OTP to Customer"}</>}
                            </Button>

                            {o.deliveryOtpSentAt && (
                              <div className="flex items-center gap-2 ml-auto">
                                <Input
                                  placeholder="Enter OTP from customer"
                                  maxLength={6}
                                  value={otpInputs[o._id] || ""}
                                  onChange={e => setOtpInputs(prev => ({ ...prev, [o._id]: e.target.value }))}
                                  className="h-7 text-xs w-44 border-purple-200 focus:border-purple-400"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => verifyOtp(o._id)}
                                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 gap-1"
                                >
                                  <ShieldCheck className="h-3 w-3" /> Verify & Deliver
                                </Button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedOrder(null)}>
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-emerald-950">Order Details</h2>
                <p className="text-xs text-muted-foreground font-mono">ID: {selectedOrder._id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-full"><X className="h-5 w-5" /></Button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-emerald-900 flex items-center gap-2 border-b pb-2 mb-3">
                    <MapPin className="h-4 w-4" /> Shipping Address
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="font-semibold text-gray-900">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedOrder.shippingAddress?.address}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} — {selectedOrder.shippingAddress?.postalCode}</p>
                    <p className="text-sm font-medium text-emerald-700 mt-2 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-emerald-900 flex items-center gap-2 border-b pb-2 mb-3">
                    <Truck className="h-4 w-4" /> Status History
                  </h3>
                  <div className="space-y-3 pl-2">
                    {selectedOrder.statusHistory?.map((h: any, i: number) => (
                      <div key={i} className="relative pl-5 pb-3 border-l-2 border-emerald-200 last:border-0 last:pb-0">
                        <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                        <p className="text-sm font-medium capitalize">{h.status.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-400">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                        {h.note && <p className="text-xs text-gray-600">{h.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-emerald-900 flex items-center gap-2 border-b pb-2 mb-3">
                  <Package className="h-4 w-4" /> Order Items
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {selectedOrder.orderItems?.map((item: any, i: number) => (
                    <div key={i} className="flex gap-3 bg-gray-50 p-3 rounded-lg border">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover bg-white" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                      </div>
                      <p className="font-bold text-sm text-emerald-700">₹{(item.qty * item.price).toFixed(0)}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Items</span><span>₹{selectedOrder.itemsPrice?.toFixed(0)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{selectedOrder.shippingPrice === 0 ? <span className="text-emerald-600">Free</span> : `₹${selectedOrder.shippingPrice?.toFixed(0)}`}</span></div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg text-emerald-700">₹{selectedOrder.totalPrice?.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
