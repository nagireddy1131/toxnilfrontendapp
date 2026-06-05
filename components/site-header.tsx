"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, User, ShoppingBag, ChevronDown, Menu, Package, X, HelpCircle, Loader2, Sparkles } from "lucide-react"
import { Leaf } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"

// ── Symptom → keyword mapping for AI-style search ──────────────────────────
const SYMPTOM_MAP: Record<string, string[]> = {
  headache:        ["pain", "inflammation", "anti-inflammatory", "curcumin"],
  "joint pain":    ["anti-inflammatory", "curcumin", "omega"],
  inflammation:    ["anti-inflammatory", "curcumin", "omega"],
  tired:           ["energy", "coq10", "iron", "multivitamin"],
  fatigue:         ["energy", "coq10", "iron", "multivitamin"],
  "low energy":    ["energy", "coq10", "iron"],
  sleep:           ["sleep", "magnesium", "relaxation"],
  insomnia:        ["sleep", "magnesium"],
  stress:          ["sleep", "relaxation", "magnesium"],
  anxiety:         ["sleep", "relaxation", "magnesium"],
  heart:           ["heart", "omega", "coq10"],
  cholesterol:     ["heart", "omega-3"],
  immunity:        ["immunity", "vitamin d", "probiotic", "multivitamin"],
  sick:            ["immunity", "vitamin d", "zinc"],
  cold:            ["immunity", "vitamin d", "zinc"],
  digestion:       ["digestive", "probiotic", "gut"],
  bloating:        ["digestive", "probiotic"],
  gut:             ["digestive", "probiotic"],
  bones:           ["vitamin d", "calcium"],
  skin:            ["omega", "vitamin", "antioxidant"],
  brain:           ["omega", "coq10", "multivitamin"],
  memory:          ["omega", "coq10"],
  muscle:          ["magnesium", "energy", "coq10"],
}

function expandQuery(query: string): string {
  const q = query.toLowerCase().trim()
  for (const [symptom, keywords] of Object.entries(SYMPTOM_MAP)) {
    if (q.includes(symptom)) {
      return keywords.join(" ")
    }
  }
  return q
}

interface SearchProduct {
  _id: string
  name: string
  category: string
  price: number
  image: string
  inStock: boolean
}

export function SiteHeader() {
  const { cartCount } = useCart()
  const router = useRouter()
  const [showShopDropdown, setShowShopDropdown] = useState(false)
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchProduct[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [isAiSuggestion, setIsAiSuggestion] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo")
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr)
        const loginTime = userInfo.loginTime || Date.now()
        if (userInfo.isAdmin) {
          setIsAdmin(true)
          setIsLoggedIn(true)
        } else {
          if (Date.now() - loginTime > 24 * 60 * 60 * 1000) {
            localStorage.removeItem("userInfo")
            setIsLoggedIn(false)
          } else {
            setIsLoggedIn(true)
          }
        }
      } catch (e) {
        setIsLoggedIn(true)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userInfo")
    localStorage.removeItem("adminInfo")
    setIsLoggedIn(false)
    setIsAdmin(false)
    router.push("/login")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery("")
      setSuggestions([])
    }
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setSuggestions([])
      setIsAiSuggestion(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        // Check if user typed a symptom/condition — if so, expand the query
        const expanded = expandQuery(query)
        const isSymptom = expanded !== query.toLowerCase().trim()
        setIsAiSuggestion(isSymptom)

        // Search with the (possibly expanded) query against backend
        const { data } = await api.get(
          `/products?search=${encodeURIComponent(expanded)}&limit=6`
        )
        const products: SearchProduct[] = Array.isArray(data) ? data : (data.products || [])
        setSuggestions(products.slice(0, 6))
      } catch {
        setSuggestions([])
      } finally {
        setSearchLoading(false)
      }
    }, 350)
  }

  return (
    <header className="sticky top-0 z-[1000] w-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex h-[50px] md:h-[70px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Leaf className="h-6 w-6 md:h-7 md:w-7 text-[#1a4d3e]" />
            <span className="text-[16px] md:text-[20px] font-semibold text-[#1a4d3e] tracking-tight font-[family-name:var(--font-montserrat)]">
              TOXNIL
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 ml-12">
            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowShopDropdown(true)}
              onMouseLeave={() => setShowShopDropdown(false)}
            >
              <button className="flex items-center gap-1 text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] hover:underline transition-colors cursor-pointer font-[family-name:var(--font-inter)]">
                Shop
                <ChevronDown className="h-4 w-4" />
              </button>
              {showShopDropdown && (
                <div className="absolute top-full left-0 pt-2 min-w-[180px] animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="bg-white border border-[#E8E8E8] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-4">
                    <Link href="/products" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">All Products</Link>
                    <Link href="/products?category=Immunity" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">Immunity</Link>
                    <Link href="/products?category=Energy" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">Energy</Link>
                    <Link href="/products?category=Heart+Health" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">Heart Health</Link>
                    <Link href="/products?category=Anti-Inflammatory" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">Anti-Inflammatory</Link>
                    <Link href="/products?category=Sleep+%26+Relaxation" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">Sleep & Relaxation</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowResourcesDropdown(true)}
              onMouseLeave={() => setShowResourcesDropdown(false)}
            >
              <button className="flex items-center gap-1 text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] hover:underline transition-colors cursor-pointer font-[family-name:var(--font-inter)]">
                Resources
                <ChevronDown className="h-4 w-4" />
              </button>
              {showResourcesDropdown && (
                <div className="absolute top-full left-0 pt-2 min-w-[180px] animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="bg-white border border-[#E8E8E8] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-4">
                    <Link href="/about" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">About Us</Link>
                    <Link href="/about#technology" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">Our Technology</Link>
                    <Link href="/contact" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">Contact</Link>
                    <Link href="/faq" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">FAQ & Help</Link>
                    <Link href="/blog" className="block px-5 py-3 text-[14px] text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e] transition-colors">Blog</Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/faq"
              className="flex items-center gap-1 text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] hover:underline transition-colors font-[family-name:var(--font-inter)]"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/account?tab=orders" className="hidden md:block">
              <Button variant="outline" className="border-2 border-[#1a4d3e] text-[#1a4d3e] bg-transparent hover:bg-[#1a4d3e] hover:text-white rounded-full px-5 py-2 text-[13px] font-medium transition-all duration-300">
                <Package className="h-4 w-4 mr-2" />
                Track your order
              </Button>
            </Link>

            {/* Smart Search */}
            {showSearch ? (
              <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                <form onSubmit={handleSearch}>
                  <Input
                    className="w-72 h-9 pl-3 pr-8 rounded-full border-[#1a4d3e] focus-visible:ring-offset-0 focus-visible:ring-[#1a4d3e]"
                    placeholder="Search or describe a symptom..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                    autoFocus
                    onBlur={() => setTimeout(() => {
                      if (!searchQuery) setShowSearch(false)
                      setSuggestions([])
                    }, 200)}
                  />
                  <button
                    type="button"
                    onClick={() => { setShowSearch(false); setSearchQuery(""); setSuggestions([]) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>

                {/* Suggestions Dropdown */}
                {(searchLoading || suggestions.length > 0 || (searchQuery.length > 1 && !searchLoading)) && (
                  <div className="absolute top-full left-0 w-[340px] mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[50]">
                    {/* AI badge when symptom detected */}
                    {isAiSuggestion && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border-b border-emerald-100">
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs text-emerald-700 font-medium">Smart suggestions based on your symptoms</span>
                      </div>
                    )}

                    {searchLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-[#1a4d3e]" />
                        <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        {suggestions.map((product) => (
                          <Link
                            key={product._id}
                            href={`/products/${product._id}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { setShowSearch(false); setSearchQuery(""); setSuggestions([]) }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50"
                          >
                            <div className="h-11 w-11 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1a4d3e] truncate">{product.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-[#5a7a77]">{product.category}</p>
                                {!product.inStock && (
                                  <span className="text-xs text-red-500 font-medium">Out of stock</span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-[#1a4d3e] flex-shrink-0">₹{product.price}</span>
                          </Link>
                        ))}
                        <Link
                          href={`/products?search=${encodeURIComponent(searchQuery)}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setShowSearch(false); setSearchQuery(""); setSuggestions([]) }}
                          className="flex items-center justify-center gap-1 px-4 py-3 bg-gray-50 text-[#1a4d3e] text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          <Search className="h-4 w-4" />
                          View all results for "{searchQuery}"
                        </Link>
                      </>
                    ) : searchQuery.length > 1 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm font-medium text-gray-700">No products found</p>
                        <p className="text-xs text-muted-foreground mt-1">We don't currently carry products matching "{searchQuery}"</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <button
                className="text-[#1a4d3e] hover:text-[#5a7a77] transition-colors"
                aria-label="Search"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-6 w-6" />
              </button>
            )}

            {/* User Account */}
            {isLoggedIn ? (
              <div
                className="relative"
                onMouseEnter={() => document.getElementById("user-dropdown")?.classList.remove("hidden")}
                onMouseLeave={() => document.getElementById("user-dropdown")?.classList.add("hidden")}
              >
                <button className="text-[#1a4d3e] hover:text-[#5a7a77] transition-colors flex items-center gap-1 pt-1">
                  <User className="h-6 w-6" />
                </button>
                <div id="user-dropdown" className="hidden absolute top-full right-0 pt-2 min-w-[150px] animate-in fade-in-0 zoom-in-95 duration-200 z-[60]">
                  <div className="bg-white border border-[#E8E8E8] rounded-lg shadow-lg py-2">
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e]">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link href="/account" className="block px-4 py-2 text-sm text-[#5a7a77] hover:bg-[#F5F5F5] hover:text-[#1a4d3e]">
                      My Profile
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-[#1a4d3e] hover:text-[#5a7a77] transition-colors pt-1">
                <User className="h-6 w-6" />
              </Link>
            )}

            {/* Cart Badge */}
            <Link href="/cart" className="relative text-[#1a4d3e] hover:text-[#5a7a77] transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#FF6B35] text-white text-[11px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-[#1a4d3e]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8E8E8] animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3">
              <Link href="/products" className="text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] py-2" onClick={() => setMobileMenuOpen(false)}>
                Shop All Products
              </Link>
              <Link href="/products?category=Immunity" className="text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] py-2" onClick={() => setMobileMenuOpen(false)}>
                Immunity
              </Link>
              <Link href="/products?category=Energy" className="text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] py-2" onClick={() => setMobileMenuOpen(false)}>
                Energy
              </Link>
              <Link href="/about" className="text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] py-2" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/faq" className="text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ & Help
              </Link>
              <Link href="/contact" className="text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <Link href={isLoggedIn ? "/account" : "/login"} className="text-[14px] font-medium text-[#5a7a77] hover:text-[#1a4d3e] py-2" onClick={() => setMobileMenuOpen(false)}>
                {isLoggedIn ? "My Account" : "Log In / Sign Up"}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
