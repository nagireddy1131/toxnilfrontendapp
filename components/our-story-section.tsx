"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import { useEffect, useRef, useState } from "react"

const MILESTONES = [
  {
    year: "2020",
    icon: "💡",
    title: "The Problem We Couldn't Ignore",
    desc: "Our founders — a pharmacologist and a wellness entrepreneur — noticed that despite spending thousands on supplements, their patients and clients saw minimal results. Lab tests confirmed it: most oral supplements had less than 20% absorption. The ingredient was never the problem. Delivery was.",
    color: "bg-amber-500",
    light: "bg-amber-50 border-amber-200",
  },
  {
    year: "2021",
    icon: "🔬",
    title: "Two Years of Research",
    desc: "We partnered with nano-pharmacology researchers at two leading Indian institutes to study lipid nano-encapsulation — a technique used in cancer drug delivery — and asked: can we apply this to everyday wellness? After 200+ formulation attempts, the answer was yes.",
    color: "bg-emerald-600",
    light: "bg-emerald-50 border-emerald-200",
  },
  {
    year: "2022",
    icon: "🧪",
    title: "First Formula Validated",
    desc: "Our nano-curcumin formula was the breakthrough. A small clinical trial showed 185× greater bioavailability versus standard turmeric powder. Participants reported real, measurable improvements in inflammation markers within 30 days. TOXNIL was born.",
    color: "bg-violet-600",
    light: "bg-violet-50 border-violet-200",
  },
  {
    year: "2023",
    icon: "🚀",
    title: "First Products Ship",
    desc: "We launched with 3 nano-formulas — Curcumin, Ashwagandha, and CoQ10. Within 6 months, 2,000+ customers gave feedback. 94% reported noticing a difference within 4 weeks. We reinvested everything into expanding the lab and the product line.",
    color: "bg-sky-600",
    light: "bg-sky-50 border-sky-200",
  },
  {
    year: "Today",
    icon: "🌏",
    title: "10,000+ Customers & Growing",
    desc: "TOXNIL now offers 8 nano-formulas spanning heart health, immunity, energy, sleep, gut health, and more. We're India's only supplement brand using pharmaceutical-grade nano-encapsulation with full label transparency and 3rd-party lab testing on every batch.",
    color: "bg-[#d4af37]",
    light: "bg-[#fffbeb] border-yellow-200",
  },
]

export function OurStorySection() {
  const [visible, setVisible] = useState<boolean[]>(Array(MILESTONES.length).fill(false))
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = refs.current.map((ref, i) => {
      if (!ref) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => { const n = [...prev]; n[i] = true; return n })
          }
        },
        { threshold: 0.2 }
      )
      obs.observe(ref)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <section id="our-story" className="py-20 bg-gradient-to-b from-[#0f2e26] to-[#1a4d3e] text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Our Journey</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-playfair leading-tight">
              From a Question<br />
              <span className="text-[#d4af37]">to a Revolution</span>
            </h2>
            <p className="text-white/60 mt-4 text-lg max-w-xl mx-auto">
              Every product we make is backed by a simple mission: make supplements that actually work.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Central vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-emerald-400 to-[#d4af37] md:-translate-x-0.5 opacity-40" />

          <div className="space-y-10">
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                ref={(el) => { refs.current[i] = el }}
                className={`relative flex gap-6 md:gap-0 transition-all duration-700 ${
                  visible[i] ? "opacity-100 translate-x-0" : i % 2 === 0 ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8"
                } ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Card */}
                <div className="flex-1 md:px-10">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{m.icon}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${m.color}`}>
                            {m.year}
                          </span>
                          <h3 className="text-lg font-bold font-playfair leading-tight">{m.title}</h3>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Centre dot */}
                <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 h-10 w-10 rounded-full border-4 border-[#1a4d3e] bg-white items-center justify-center text-lg z-10 shadow-lg">
                  {m.icon}
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />

                {/* Mobile dot */}
                <div className="md:hidden flex-shrink-0 w-8 flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full ${m.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                    {i + 1}
                  </div>
                  {i < MILESTONES.length - 1 && <div className="flex-1 w-0.5 bg-white/20 mt-2" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <ScrollReveal>
          <div className="mt-16 text-center bg-white/5 border border-white/10 rounded-3xl p-8">
            <p className="text-2xl md:text-3xl font-bold font-playfair text-white leading-snug">
              &ldquo;We didn't just want to sell supplements.<br />
              <span className="text-[#d4af37]">We wanted to make them actually work.&rdquo;</span>
            </p>
            <p className="text-white/50 mt-4 text-sm">— The TOXNIL Founding Team</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
