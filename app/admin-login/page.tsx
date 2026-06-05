"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Eye, EyeOff, Loader2, ShieldCheck, Lock } from "lucide-react"
import api from "@/lib/api"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError("Please fill in all fields."); return }
    setError("")
    setIsLoading(true)
    try {
      const isPhone = /^\+?[0-9\s-]{8,}$/.test(email.trim())
      const payload = isPhone
        ? { phone: email.trim(), password }
        : { email: email.trim(), password }

      const { data } = await api.post("/users/login", payload)

      if (!data.isAdmin) {
        setError("Access denied. This portal is for admins only.")
        setIsLoading(false)
        return
      }

      localStorage.setItem("adminInfo", JSON.stringify(data))
      localStorage.setItem("userInfo", JSON.stringify(data))
      router.push("/admin")
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-4 backdrop-blur-sm">
            <Leaf className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TOXNIL</h1>
          <p className="text-emerald-400 text-sm mt-1 font-medium tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Secure Admin Login</h2>
              <p className="text-sm text-emerald-300/70">Authorized personnel only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-100">Email or Phone</label>
              <input
                type="text"
                value={email}
                onChange={e => { setEmail(e.target.value); setError("") }}
                placeholder="admin@toxnil.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-100">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError("") }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm">
                <Lock className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating...</>
              ) : (
                <><ShieldCheck className="h-4 w-4" /> Sign in to Dashboard</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <a href="/" className="text-sm text-emerald-400/70 hover:text-emerald-400 transition-colors">
              ← Back to TOXNIL Website
            </a>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © {new Date().getFullYear()} TOXNIL. Restricted access.
        </p>
      </div>
    </div>
  )
}
