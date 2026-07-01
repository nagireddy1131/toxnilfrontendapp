"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import { CheckCircle2, XCircle, ShieldCheck, FlaskConical, Leaf } from "lucide-react"
import Link from "next/link"

const BENEFITS = [
  { text: "No synthetic fillers, binders, or coatings" },
  { text: "No artificial colours or flavours" },
  { text: "Gluten-free, soy-free, dairy-free" },
  { text: "Zero heavy metal contamination (tested every batch)" },
  { text: "No proprietary blends — 100% label transparency" },
  { text: "Vegetable capsules, no gelatin" },
  { text: "No habit-forming compounds or stimulants" },
  { text: "Non-GMO and sustainably sourced" },
]

const SIDE_EFFECTS_COMMON = [
  "Headaches from fillers",
  "Nausea from synthetic binders",
  "Liver stress from high doses",
  "Poor sleep from hidden stimulants",
  "Allergic reactions to coatings",
]

const CERTIFICATIONS = [
  { icon: "🧪", label: "3rd-Party Lab Tested" },
  { icon: "🌿", label: "GMP Certified Facility" },
  { icon: "🔬", label: "Nano-Pharma Grade" },
  { icon: "📋", label: "Full Ingredient Disclosure" },
]

export function PureBenefitsSection() {
  return (
    <section id="pure-benefits" className="py-20 bg-[#F5F3F0] overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Our Promise to You</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a4d3e] font-playfair leading-tight">
              Pure Benefits.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-[#d4af37]">
                Zero Compromise.
              </span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Every TOXNIL product is formulated to give you the full benefit of nature — without any of the unnecessary ingredients most brands hide on the label.
            </p>
          </div>
        </ScrollReveal>

        {/* Main split layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">

          {/* Left: What's IN */}
          <ScrollReveal stagger={1}>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a4d3e]">What you always get</h3>
                  <p className="text-sm text-gray-400">Every single TOXNIL product</p>
                </div>
              </div>
              <ul className="space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b.text} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Right: What's NOT + Certifications */}
          <div className="space-y-6">
            <ScrollReveal stagger={2}>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1a4d3e]">Common side effects we eliminate</h3>
                    <p className="text-sm text-gray-400">Found in most standard supplements</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {SIDE_EFFECTS_COMMON.map((s) => (
                    <li key={s} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <XCircle className="h-3.5 w-3.5 text-red-400" />
                      </div>
                      <span className="text-gray-400 line-through text-sm">{s}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-emerald-700 text-sm font-semibold mt-4 pt-4 border-t border-gray-100">
                  ✅ With TOXNIL's clean-label nano formula, these simply don't apply.
                </p>
              </div>
            </ScrollReveal>

            {/* Certifications */}
            <ScrollReveal stagger={3}>
              <div className="bg-gradient-to-br from-[#1a4d3e] to-[#2d6a5a] rounded-3xl p-6 text-white shadow-lg">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Quality Assurance</p>
                <div className="grid grid-cols-2 gap-3">
                  {CERTIFICATIONS.map((c) => (
                    <div key={c.label} className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                      <span className="text-2xl">{c.icon}</span>
                      <span className="text-white text-sm font-semibold leading-tight">{c.label}</span>
                    </div>
                  ))}
                </div>
                <Link href="/products">
                  <button className="mt-4 w-full py-2.5 bg-[#d4af37] hover:bg-[#c49d25] text-[#1a4d3e] font-bold rounded-xl text-sm transition-all hover:scale-105">
                    Shop Clean Label Products
                  </button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom stat strip */}
        <ScrollReveal>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { stat: "0", label: "Artificial additives", sub: "in every product" },
              { stat: "100%", label: "Label transparency", sub: "full disclosure always" },
              { stat: "3rd", label: "Party tested", sub: "independent lab every batch" },
              { stat: "30", label: "Day results", sub: "or we'll refund you" },
            ].map((item) => (
              <div key={item.stat} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-[#1a4d3e] font-playfair">{item.stat}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
