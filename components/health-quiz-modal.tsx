"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import api from "@/lib/api"

const HEALTH_CATEGORIES = [
  {
    id: "Heart Health",
    label: "Heart Health",
    emoji: "❤️",
    desc: "Cardiovascular support",
    gradient: "from-rose-100 to-pink-50",
    border: "border-rose-200",
    selected: "border-rose-500 bg-rose-50",
    check: "bg-rose-500",
  },
  {
    id: "Sleep & Relaxation",
    label: "Sleep & Mind",
    emoji: "🧠",
    desc: "Better sleep & stress relief",
    gradient: "from-violet-100 to-purple-50",
    border: "border-violet-200",
    selected: "border-violet-500 bg-violet-50",
    check: "bg-violet-500",
  },
  {
    id: "Energy",
    label: "Energy & Focus",
    emoji: "⚡",
    desc: "All-day vitality",
    gradient: "from-amber-100 to-yellow-50",
    border: "border-amber-200",
    selected: "border-amber-500 bg-amber-50",
    check: "bg-amber-500",
  },
  {
    id: "Immunity",
    label: "Immunity",
    emoji: "🛡️",
    desc: "Strengthen defences",
    gradient: "from-orange-100 to-orange-50",
    border: "border-orange-200",
    selected: "border-orange-500 bg-orange-50",
    check: "bg-orange-500",
  },
  {
    id: "Anti-Inflammatory",
    label: "Joints & Bones",
    emoji: "🦴",
    desc: "Mobility & inflammation relief",
    gradient: "from-sky-100 to-blue-50",
    border: "border-sky-200",
    selected: "border-sky-500 bg-sky-50",
    check: "bg-sky-500",
  },
  {
    id: "Digestive Health",
    label: "Gut Health",
    emoji: "🌱",
    desc: "Digestion & microbiome",
    gradient: "from-emerald-100 to-green-50",
    border: "border-emerald-200",
    selected: "border-emerald-500 bg-emerald-50",
    check: "bg-emerald-500",
  },
]

interface HealthQuizModalProps {
  onClose?: () => void
}

export function HealthQuizModal({ onClose }: HealthQuizModalProps) {
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Show after tiny delay to allow page to render first
    const timer = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(timer)
  }, [])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (selected.length === 0) return
    setSaving(true)

    // Always save to localStorage for non-logged-in users
    localStorage.setItem("healthGoals", JSON.stringify(selected))
    localStorage.setItem("healthGoalsSet", "true")

    // If user is logged in, also save to backend
    try {
      const userInfoStr = localStorage.getItem("userInfo")
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        await api.put(
          "/users/health-goals",
          { healthGoals: selected },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        )
      }
    } catch {
      // Non-critical — localStorage is the fallback
    }

    setSaving(false)
    setDone(true)
    setTimeout(() => {
      handleClose()
    }, 1200)
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-modal-slide-up scrollbar-hide">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a4d3e] to-[#2d6a5a] px-8 pt-10 pb-8 text-white rounded-t-3xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-full bg-[#d4af37] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#d4af37] uppercase tracking-widest">
              Personalise Your Experience
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-playfair leading-snug">
            What would you like to improve?
          </h2>
          <p className="text-white/75 mt-2 text-sm md:text-base">
            Select all that apply — we'll show you the most relevant products.
          </p>
        </div>

        {/* Category Grid */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {HEALTH_CATEGORIES.map((cat) => {
              const isSelected = selected.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggle(cat.id)}
                  className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 bg-gradient-to-br ${cat.gradient} ${
                    isSelected
                      ? `${cat.selected} shadow-md scale-[1.02] quiz-card-selected`
                      : `${cat.border} hover:shadow-sm hover:scale-[1.01]`
                  }`}
                >
                  {/* Checkmark */}
                  {isSelected && (
                    <div className={`absolute top-2.5 right-2.5 h-5 w-5 rounded-full ${cat.check} flex items-center justify-center`}>
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{cat.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{cat.desc}</p>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleClose}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip for now
            </button>
            <Button
              onClick={handleSave}
              disabled={selected.length === 0 || saving || done}
              className={`h-11 px-8 rounded-xl font-semibold text-sm transition-all duration-300 ${
                done
                  ? "bg-emerald-600 text-white"
                  : "bg-[#1a4d3e] hover:bg-[#2d6a5a] text-white hover:scale-105"
              }`}
            >
              {done ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  All set! Let's go
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                <>
                  Show My Recommendations
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {selected.length > 0 && !done && (
            <p className="text-center text-xs text-gray-400 mt-3">
              {selected.length} goal{selected.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
