"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts"
import {
  Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb,
  PackageX, Activity, RefreshCw, ArrowUp, ArrowDown, Target,
  ShoppingCart, Tag, Zap, ChevronRight
} from "lucide-react"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

function StatBadge({ value, positive }: { value: number; positive?: boolean }) {
  const isPos = positive !== undefined ? positive : value >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${isPos ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
      {isPos ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {Math.abs(value)}%
    </span>
  )
}

export default function AnalyticsPage() {
  const [pricing, setPricing] = useState<any>(null)
  const [categories, setCategories] = useState<any>(null)
  const [products, setProducts] = useState<any>(null)
  const [orders, setOrders] = useState<any>(null)
  const [sales, setSales] = useState<any>(null)
  const [visitors, setVisitors] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchAll = async () => {
    try {
      const [pricingRes, catRes, prodRes, ordRes, salesRes, visRes] = await Promise.all([
        api.get('/admin/insights/pricing'),
        api.get('/admin/stats/categories'),
        api.get('/admin/stats/products'),
        api.get('/admin/stats/orders'),
        api.get('/admin/insights/sales'),
        api.get('/admin/stats/visitors?days=7'),
      ])
      setPricing(pricingRes.data)
      setCategories(catRes.data)
      setProducts(prodRes.data)
      setOrders(ordRes.data)
      setSales(salesRes.data)
      setVisitors(visRes.data)
    } catch {
      toast({ title: "Error loading analytics", variant: "destructive" })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleRefresh = () => { setRefreshing(true); fetchAll() }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-emerald-600 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="text-muted-foreground font-medium animate-pulse">Running AI Analysis…</p>
    </div>
  )

  // Derived data
  const topProducts = products?.topBySales || []
  const lowStock = products?.lowStock || []
  const categoryData = categories?.salesByCategory || []
  const pricingInsights = pricing?.insights || []
  const raisePrice = pricingInsights.filter((p: any) => p.priceChange > 0).slice(0, 4)
  const lowerPrice = pricingInsights.filter((p: any) => p.priceChange < 0).slice(0, 4)
  const orderByStatus = (orders?.byStatus || []).map((s: any) => ({ name: s._id, value: s.count }))
  const salesInsights = sales?.insights || []
  const convRate = sales?.stats?.conversionRate || 0
  const repeatRate = sales?.stats?.repeatOrderRate || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-emerald-600" /> AI Insights & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Demand-driven pricing · Category health · Sales optimization</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* AI Action Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesInsights.slice(0, 4).map((ins: any, i: number) => (
          <Card key={i} className={`border-l-4 shadow-sm ${
            ins.type === "warning" ? "border-l-amber-500 bg-amber-50/60" :
            ins.type === "opportunity" ? "border-l-blue-500 bg-blue-50/60" :
            ins.type === "success" ? "border-l-emerald-500 bg-emerald-50/60" : "border-l-purple-500 bg-purple-50/60"
          }`}>
            <CardContent className="p-4">
              <div className="flex gap-3 items-start">
                {ins.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />}
                {ins.type === "opportunity" && <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />}
                {ins.type === "success" && <Activity className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />}
                {ins.type === "tip" && <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />}
                <div>
                  <p className="font-semibold text-sm text-gray-900">{ins.title}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-snug">{ins.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: `${convRate}%`, icon: Target, color: "text-blue-600", bg: "bg-blue-50", tip: "Visitors who placed an order" },
          { label: "Repeat Order Rate", value: `${repeatRate}%`, icon: RefreshCw, color: "text-purple-600", bg: "bg-purple-50", tip: "Customers who ordered >1 time" },
          { label: "Price-Up Candidates", value: raisePrice.length, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", tip: "Products with high demand" },
          { label: "Price-Down Candidates", value: lowerPrice.length, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50", tip: "Products with low demand" },
        ].map((kpi, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">{kpi.tip}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demand-Based Pricing */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Raise Price */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-emerald-800">
              <ArrowUp className="h-5 w-5 text-emerald-600" /> Increase Price — High Demand
            </CardTitle>
            <CardDescription>Products selling well. Raise price to maximize revenue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {raisePrice.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No high-demand products identified yet.</p>}
            {raisePrice.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.reasoning}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Recent sales: {item.recentSales} units</p>
                </div>
                <div className="text-right pl-4 shrink-0">
                  <p className="text-xs line-through text-gray-400">₹{item.product.currentPrice}</p>
                  <p className="font-bold text-emerald-700 text-lg">₹{item.suggestedPrice}</p>
                  <StatBadge value={item.priceChange} positive={true} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lower Price */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-red-800">
              <ArrowDown className="h-5 w-5 text-red-500" /> Reduce Price — Low Demand
            </CardTitle>
            <CardDescription>Products not selling. Reduce price to clear stock and boost sales.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowerPrice.length === 0 && <p className="text-sm text-gray-400 text-center py-6">All products have good demand.</p>}
            {lowerPrice.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.reasoning}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Recent sales: {item.recentSales} units</p>
                </div>
                <div className="text-right pl-4 shrink-0">
                  <p className="text-xs line-through text-gray-400">₹{item.product.currentPrice}</p>
                  <p className="font-bold text-red-600 text-lg">₹{item.suggestedPrice}</p>
                  <StatBadge value={item.priceChange} positive={false} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Category Performance & Order Pipeline */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Health */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Tag className="h-5 w-5 text-indigo-600" /> Category Sales Breakdown</CardTitle>
            <CardDescription>Best and worst performing product categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No orders yet to analyze categories.</p>
            ) : (
              <>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData.slice(0, 6)} layout="vertical" margin={{ left: 8, right: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tickFormatter={(v) => `₹${v > 999 ? (v/1000).toFixed(1)+'k' : v}`} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="category" width={90} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: any) => [`₹${v.toFixed(0)}`, "Revenue"]} />
                      <Bar dataKey="sales" radius={[0,6,6,0]}>
                        {categoryData.slice(0, 6).map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryData.slice(0, 4).map((cat: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-gray-700 font-medium">{cat.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-xs">{cat.qty} units</span>
                        <span className="font-semibold text-gray-900">₹{cat.sales.toFixed(0)}</span>
                        <span className="text-xs text-gray-400">{cat.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                {categoryData.length > 1 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                    <p className="font-semibold text-amber-800 flex items-center gap-1"><Lightbulb className="h-4 w-4" /> AI Recommendation</p>
                    <p className="text-amber-700 mt-1 text-xs">
                      <strong>{categoryData[0]?.category}</strong> is your top category ({categoryData[0]?.percentage}% of revenue). 
                      Consider adding more products here. <strong>{categoryData[categoryData.length-1]?.category}</strong> has the lowest sales — 
                      try bundle offers or discounts to boost it.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Pipeline */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><ShoppingCart className="h-5 w-5 text-purple-600" /> Order Pipeline Status</CardTitle>
            <CardDescription>Where orders are currently in the fulfillment flow</CardDescription>
          </CardHeader>
          <CardContent>
            {orderByStatus.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No orders yet.</p>
            ) : (
              <>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={orderByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {orderByStatus.map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Lag analysis */}
                {orderByStatus.filter((s: any) => ['pending','processing'].includes(s.name)).map((s: any, i: number) => (
                  <div key={i} className="mt-3 flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-800">
                      <strong>{s.value} orders</strong> are stuck at <strong className="capitalize">{s.name}</strong>.
                      {s.name === 'pending' ? " Process them quickly to avoid cancellations." : " Ship these to move to delivery."}
                    </p>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top selling products */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Zap className="h-5 w-5 text-amber-500" /> Top Selling Products</CardTitle>
            <CardDescription>Highest units sold — focus your marketing here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.slice(0, 6).map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-700" : "bg-gray-300"}`}>
                  {i + 1}
                </span>
                {p.image && <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.category} · ₹{p.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-700 text-sm">{p.salesCount}</p>
                  <p className="text-[10px] text-gray-400">units sold</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-center text-gray-400 py-6">No sales data yet.</p>}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-red-800">
              <PackageX className="h-5 w-5 text-red-500" /> Low Stock Alerts
            </CardTitle>
            <CardDescription>Products with ≤5 units — restock before they run out</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-emerald-700 font-medium">All products are well stocked!</p>
              </div>
            )}
            {lowStock.map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-red-100 bg-red-50">
                {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border" />}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${p.countInStock === 0 ? "bg-red-600 text-white" : "bg-red-100 text-red-700"}`}>
                  {p.countInStock === 0 ? "Out of Stock" : `${p.countInStock} left`}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Sales Improvement Recommendations */}
      {salesInsights.length > 4 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><ChevronRight className="h-5 w-5 text-indigo-600" /> More AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {salesInsights.slice(4).map((ins: any, i: number) => (
                <div key={i} className={`p-4 rounded-xl border text-sm ${
                  ins.type === "warning" ? "border-amber-200 bg-amber-50" :
                  ins.type === "opportunity" ? "border-blue-200 bg-blue-50" :
                  ins.type === "success" ? "border-emerald-200 bg-emerald-50" : "border-purple-200 bg-purple-50"
                }`}>
                  <p className="font-semibold text-gray-900">{ins.title}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-snug">{ins.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-gray-400 text-right">
        Analysis generated at {pricing?.generatedAt ? new Date(pricing.generatedAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
      </p>
    </div>
  )
}
