"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Package, 
  PlusSquare, 
  ShoppingCart, 
  Users, 
  LogOut,
  Leaf,
  Settings
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminInfoStr = localStorage.getItem("adminInfo")
    if (!adminInfoStr) {
      router.push("/login")
      return
    }

    try {
      const adminInfo = JSON.parse(adminInfoStr)
      if (!adminInfo.isAdmin) {
        router.push("/login")
        return
      }

      // Check session expiry (10 minutes)
      const loginTime = adminInfo.loginTime || Date.now()
      const now = Date.now()
      if (now - loginTime > 10 * 60 * 1000) { // 10 minutes
        handleLogout("Session expired. Please log in again.")
        return
      }
      setIsAdmin(true)
    } catch (e) {
      router.push("/login")
    }

    // Activity tracker to extend session
    let timeoutId: NodeJS.Timeout;
    
    const updateActivity = () => {
      const info = localStorage.getItem("adminInfo")
      if (info) {
        const parsed = JSON.parse(info)
        parsed.loginTime = Date.now()
        localStorage.setItem("adminInfo", JSON.stringify(parsed))
      }
      
      // Reset timeout
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        handleLogout("You have been logged out due to inactivity.")
      }, 10 * 60 * 1000) // 10 mins
    }

    // Initialize the idle timeout
    updateActivity()

    window.addEventListener("mousemove", updateActivity)
    window.addEventListener("keydown", updateActivity)
    window.addEventListener("click", updateActivity)

    return () => {
      window.removeEventListener("mousemove", updateActivity)
      window.removeEventListener("keydown", updateActivity)
      window.removeEventListener("click", updateActivity)
      clearTimeout(timeoutId)
    }
  }, [router])

  const handleLogout = (msg = "Logged out successfully") => {
    localStorage.removeItem("adminInfo")
    localStorage.removeItem("userInfo")
    toast({
      title: "Logged out",
      description: msg,
    })
    router.push("/login")
  }

  if (!isAdmin) return <div className="min-h-screen bg-muted/30 flex items-center justify-center">Authenticating...</div>

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Analytics & AI", href: "/admin/analytics", icon: Leaf },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Add Product", href: "/admin/products/new", icon: PlusSquare },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2">
          <Leaf className="h-8 w-8 text-emerald-400" />
          <span className="text-2xl font-bold tracking-tight">TOXNIL</span>
        </div>
        
        <div className="px-6 py-2">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Admin Portal</p>
        </div>

        <nav className="flex-1 px-4 mt-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href) && 
               // Prevent /admin/products/new from making /admin/products active
               (item.href !== "/admin/products" || pathname === "/admin/products" || pathname.startsWith("/admin/products/edit/")))
            
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-emerald-800 text-white shadow-sm" 
                    : "text-emerald-200 hover:bg-emerald-900/50 hover:text-white"
                }`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={() => handleLogout()}
            className="flex items-center gap-3 px-4 py-3 w-full text-emerald-200 hover:bg-emerald-900/50 hover:text-white rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-emerald-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight">TOXNIL Admin</span>
          </div>
          <button onClick={() => handleLogout()} className="text-emerald-200 hover:text-white">
            <LogOut className="h-6 w-6" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
