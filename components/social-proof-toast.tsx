"use client"

import { useEffect, useState } from "react"
import { X, ShoppingBag } from "lucide-react"

const NOTIFICATIONS = [
  { name: "Rahul M.", city: "Mumbai", product: "Nano Ashwagandha", time: "2 min ago" },
  { name: "Priya S.", city: "Bengaluru", product: "Nano Curcumin Plus", time: "5 min ago" },
  { name: "Arjun K.", city: "Delhi", product: "CoQ10 Heart Formula", time: "8 min ago" },
  { name: "Sneha R.", city: "Hyderabad", product: "Vitamin D3 Nano", time: "11 min ago" },
  { name: "Vikram T.", city: "Chennai", product: "Berberine Complex", time: "3 min ago" },
  { name: "Ananya P.", city: "Pune", product: "Nano Ginger Extract", time: "6 min ago" },
  { name: "Rohit B.", city: "Kolkata", product: "Nano Ashwagandha", time: "9 min ago" },
  { name: "Deepa N.", city: "Ahmedabad", product: "Omega-3 Nano", time: "14 min ago" },
]

export function SocialProofToast() {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return

    // First show after 6 seconds
    const first = setTimeout(() => setVisible(true), 6000)
    return () => clearTimeout(first)
  }, [dismissed])

  useEffect(() => {
    if (!visible || dismissed) return

    // Auto-hide after 4 seconds, then cycle to next
    const hide = setTimeout(() => {
      setVisible(false)
      const next = setTimeout(() => {
        setCurrent((c) => (c + 1) % NOTIFICATIONS.length)
        setVisible(true)
      }, 6000) // gap between toasts
      return () => clearTimeout(next)
    }, 4500)

    return () => clearTimeout(hide)
  }, [visible, current, dismissed])

  if (dismissed || !visible) return null

  const n = NOTIFICATIONS[current]

  return (
    <div className="fixed bottom-24 left-4 z-[900] max-w-xs animate-in slide-in-from-left-4 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {n.name.charAt(0)}
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">{n.name} from {n.city}</p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            <ShoppingBag className="inline h-3.5 w-3.5 text-emerald-600 mr-1" />
            Purchased {n.product}
          </p>
          <p className="text-xs text-gray-400">{n.time}</p>
        </div>
        {/* Close */}
        <button
          onClick={() => { setVisible(false); setDismissed(true) }}
          className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
