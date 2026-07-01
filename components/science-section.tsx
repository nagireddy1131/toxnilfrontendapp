"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ArrowRight, Zap, Shield, Leaf, FlaskConical, ChevronDown } from "lucide-react"
import Link from "next/link"

const INGREDIENTS = [
  {
    name: "Ashwagandha",
    emoji: "🌿",
    compound: "Withanolides",
    benefit: "Stress reduction & cortisol balance",
    nano: "Nano-encapsulation increases withanolide bioavailability by 8×",
    color: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    tag: "bg-orange-100 text-orange-700",
  },
  {
    name: "Curcumin",
    emoji: "🌻",
    compound: "Curcuminoids",
    benefit: "Powerful anti-inflammatory action",
    nano: "NanoCurcumin absorbs 185× better than standard turmeric powder",
    color: "from-yellow-50 to-orange-50",
    border: "border-yellow-200",
    tag: "bg-yellow-100 text-yellow-700",
  },
  {
    name: "Berberine",
    emoji: "🫐",
    compound: "Berberine HCl",
    benefit: "Blood sugar & metabolic support",
    nano: "Nano delivery crosses the gut barrier — traditional berberine barely reaches the bloodstream",
    color: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    tag: "bg-purple-100 text-purple-700",
  },
  {
    name: "CoQ10",
    emoji: "❤️",
    compound: "Ubiquinone",
    benefit: "Heart energy & cellular protection",
    nano: "Lipid-nano formulation boosts CoQ10 absorption from 2% to 40%",
    color: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    tag: "bg-rose-100 text-rose-700",
  },
  {
    name: "Ginger Extract",
    emoji: "🫚",
    compound: "Gingerols & Shogaols",
    benefit: "Gut motility & anti-nausea",
    nano: "Nano-ginger bypasses first-pass metabolism for faster gut relief",
    color: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    tag: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Vitamin D3",
    emoji: "☀️",
    compound: "Cholecalciferol",
    benefit: "Immunity & bone strength",
    nano: "Oil-in-water nano-emulsion raises serum D3 50% higher than oil softgels",
    color: "from-sky-50 to-blue-50",
    border: "border-sky-200",
    tag: "bg-sky-100 text-sky-700",
  },
]

const PROCESS_STEPS = [
  {
    step: "01",
    icon: "🌿",
    title: "Raw Material Sourcing",
    desc: "We source only standardised, pharmaceutical-grade botanical extracts from certified farms. Every batch is tested for heavy metals and pesticides before entering our lab.",
  },
  {
    step: "02",
    icon: "⚗️",
    title: "Nano-Particle Reduction",
    desc: "Using high-pressure homogenisation and lipid-nano encapsulation, we reduce active compounds to 50–200 nanometres — small enough to slip through cell walls.",
  },
  {
    step: "03",
    icon: "🔬",
    title: "Stability & Purity Testing",
    desc: "Every nano-batch undergoes 3rd-party lab testing for particle size distribution, potency, microbiological purity, and shelf-life stability before being approved.",
  },
  {
    step: "04",
    icon: "💊",
    title: "Precision Encapsulation",
    desc: "The validated nano-formula is filled into clean-label vegetable capsules with no binders, fillers, or artificial coatings — just the nano-ingredient in its carrier.",
  },
  {
    step: "05",
    icon: "🚀",
    title: "Cellular Absorption",
    desc: "Once swallowed, our nano-particles enter the bloodstream 10× faster, reach target tissues in higher concentrations, and stay active longer than standard supplements.",
  },
]

export function ScienceSection() {
  const [activeIngredient, setActiveIngredient] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [visibleStep, setVisibleStep] = useState<number | null>(null)

  return (
    <section id="science" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
              <FlaskConical className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">The Science Behind TOXNIL</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a4d3e] font-playfair leading-tight">
              Why Most Supplements<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-[#d4af37]">
                Fail to Work
              </span>
            </h2>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
              The problem isn't the ingredient — it's the size. Standard supplements are too large to cross cell walls.
              Nanotechnology changes everything.
            </p>
          </div>
        </ScrollReveal>

        {/* Size Comparison Visual */}
        <ScrollReveal>
          <div className="bg-gradient-to-br from-[#0f2e26] to-[#1a4d3e] rounded-3xl p-8 md:p-12 mb-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-emerald-600/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#d4af37]/10 blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <p className="text-emerald-300 text-sm font-semibold uppercase tracking-widest mb-2">Particle Size Comparison</p>
                <h3 className="text-2xl md:text-3xl font-bold font-playfair">The Nano Advantage</h3>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                {/* Standard Pill */}
                <div className="text-center">
                  <div className="flex items-end justify-center gap-3 mb-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-500/30 border-2 border-gray-400/30 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-3xl">💊</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Standard</p>
                      <p className="text-2xl font-bold text-gray-300">500μm</p>
                      <p className="text-xs text-gray-400">micrometres</p>
                    </div>
                  </div>
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2">
                    <p className="text-red-300 font-bold text-sm">❌ Cannot cross cell walls</p>
                    <p className="text-red-200/70 text-xs mt-0.5">~15% absorption rate</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-4xl hidden md:block text-emerald-400 font-bold">→</div>
                <div className="text-4xl md:hidden text-emerald-400 font-bold">↓</div>

                {/* Nano Particle */}
                <div className="text-center">
                  <div className="flex items-end justify-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-400/40 border-2 border-emerald-400/60 flex items-center justify-center">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald-400" />
                      </div>
                      {/* Glow rings */}
                      <div className="absolute inset-0 rounded-full border border-emerald-400/20 scale-150 animate-ping" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-emerald-300 uppercase tracking-wide font-bold">TOXNIL Nano</p>
                      <p className="text-2xl font-bold text-emerald-300">100nm</p>
                      <p className="text-xs text-emerald-400">nanometres</p>
                    </div>
                  </div>
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2">
                    <p className="text-emerald-300 font-bold text-sm">✅ Directly enters cells</p>
                    <p className="text-emerald-200/70 text-xs mt-0.5">Up to 95% absorption rate</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-emerald-200/60 text-xs mt-6">
                * Comparative bioavailability based on published nano-pharmacology research
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 5-Step Process */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1a4d3e] font-playfair">How We Make It</h3>
              <p className="text-gray-500 mt-2">From raw plant to nano-capsule — every step matters</p>
            </div>
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-[28px] md:left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-400 to-[#d4af37] hidden md:block -translate-x-0.5" />
              <div className="space-y-6 md:space-y-0">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.step}
                    className={`relative flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center md:gap-12 mb-8`}
                  >
                    {/* Step card */}
                    <div className="flex-1 group">
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl flex-shrink-0">{step.icon}</div>
                          <div>
                            <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-1">Step {step.step}</p>
                            <h4 className="text-lg font-bold text-[#1a4d3e] mb-2 font-playfair">{step.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex h-12 w-12 flex-shrink-0 rounded-full bg-[#1a4d3e] items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                      {step.step}
                    </div>

                    {/* Spacer for alternating */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Ingredient Spotlight */}
        <ScrollReveal>
          <div className="mb-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1a4d3e] font-playfair">Key Ingredients</h3>
              <p className="text-gray-500 mt-2">Tap any ingredient to learn what makes it extraordinary at nano scale</p>
            </div>
            {/* Ingredient selector tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {INGREDIENTS.map((ing, i) => (
                <button
                  key={ing.name}
                  onClick={() => { setActiveIngredient(i); setFlipped(false) }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activeIngredient === i
                      ? "bg-[#1a4d3e] text-white border-[#1a4d3e] shadow-md scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#1a4d3e]/40"
                  }`}
                >
                  {ing.emoji} {ing.name}
                </button>
              ))}
            </div>

            {/* Ingredient detail card */}
            <div
              className={`relative max-w-xl mx-auto rounded-3xl p-8 border-2 bg-gradient-to-br ${INGREDIENTS[activeIngredient].color} ${INGREDIENTS[activeIngredient].border} transition-all duration-500 cursor-pointer`}
              onClick={() => setFlipped(!flipped)}
            >
              <div className="absolute top-4 right-4 text-xs text-gray-400">Click to flip</div>
              {!flipped ? (
                <div>
                  <div className="text-5xl mb-4">{INGREDIENTS[activeIngredient].emoji}</div>
                  <h4 className="text-2xl font-bold text-gray-900 font-playfair mb-1">{INGREDIENTS[activeIngredient].name}</h4>
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${INGREDIENTS[activeIngredient].tag}`}>
                    Active: {INGREDIENTS[activeIngredient].compound}
                  </span>
                  <p className="text-gray-700 font-semibold mb-3">🎯 What it does</p>
                  <p className="text-gray-600">{INGREDIENTS[activeIngredient].benefit}</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-4">⚗️</div>
                  <h4 className="text-xl font-bold text-gray-900 font-playfair mb-3">The Nano Advantage</h4>
                  <p className="text-gray-700 leading-relaxed">{INGREDIENTS[activeIngredient].nano}</p>
                  <div className="mt-6 p-3 bg-white/60 rounded-xl border border-white/80">
                    <p className="text-xs text-gray-500">📄 Based on published pharmacokinetic studies on nano-formulated {INGREDIENTS[activeIngredient].name.toLowerCase()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <div className="text-center mt-12">
            <Link href="/products">
              <button className="inline-flex items-center gap-2 bg-[#1a4d3e] hover:bg-[#2d6a5a] text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg">
                Explore All Products <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
