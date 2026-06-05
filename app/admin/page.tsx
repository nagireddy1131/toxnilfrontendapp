"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react"
import api from "@/lib/api"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts"

const COLORS = ['#059669', '#2563eb', '#d97706', '#7c3aed', '#db2777']

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null)
  const [revenueTrend, setRevenueTrend] = useState<any[]>([])
  const [categorySales, setCategorySales] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}")
    api.defaults.headers.common["Authorization"] = `Bearer ${adminInfo.token}`

    const fetchData = async () => {
      try {
        const [overviewRes, revenueRes, categoryRes] = await Promise.all([
          api.get("/admin/stats/overview"),
          api.get("/admin/stats/revenue?days=7"),
          api.get("/admin/stats/categories")
        ])
        
        setStats(overviewRes.data)
        setRevenueTrend(revenueRes.data.daily || [])
        setCategorySales(categoryRes.data.salesByCategory || [])
      } catch (e) {
        console.error("Failed to fetch dashboard data", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) return <div>Loading Dashboard...</div>
  if (!stats) return <div>Failed to load stats.</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-emerald-950">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-700" />
            </div>
            <span className={`text-sm font-semibold ${stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenue.growth}%
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-emerald-800">₹{stats.revenue.total.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-6 border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-700" />
            </div>
            <span className={`text-sm font-semibold ${stats.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.orders.growth}%
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-blue-800">{stats.orders.total}</p>
          </div>
        </Card>

        <Card className="p-6 border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-700" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Products</p>
            <p className="text-3xl font-bold text-orange-800">{stats.products.total}</p>
            {stats.products.lowStock > 0 && (
              <p className="text-xs text-red-500 font-semibold mt-1">{stats.products.lowStock} Low Stock</p>
            )}
          </div>
        </Card>

        <Card className="p-6 border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold text-purple-800">{stats.users.total}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">+{stats.users.newThisMonth} this month</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6">Revenue Trend (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} dot={{r: 4, fill: '#059669'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6">Sales by Category</h3>
          <div className="h-[300px] w-full">
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="sales"
                    nameKey="category"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No category data yet.</div>
            )}
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
          <h3 className="font-bold text-lg mb-6">Order Volume (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <RechartsTooltip formatter={(value: number) => [value, 'Orders']} />
                <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
    </div>
  )
}
