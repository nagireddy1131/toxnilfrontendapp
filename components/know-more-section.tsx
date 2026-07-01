"use client"

import { useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ChevronDown, Play, BookOpen, Leaf, FlaskConical } from "lucide-react"

const FAQS = [
  {
    q: "Why do most supplements have low absorption?",
    a: "Standard supplement particles are 100–500 micrometres in diameter. The cells in your gut lining are only about 20–50 nanometres in diameter. That's like trying to push a football through a keyhole. Most of the active ingredient simply passes through your digestive system unused — which is why you may have tried supplements before and seen little effect.",
  },
  {
    q: "How does nanotechnology fix the absorption problem?",
    a: "Nanotechnology reduces the active compound to 50–200 nanometres — small enough to slip through cell membranes and enter the bloodstream directly. We wrap each nano-particle in a lipid (fat-based) coating that makes it water-soluble and immune to stomach acid, so it reaches the intestine intact and absorbs almost completely.",
  },
  {
    q: "Is nanotechnology in supplements safe?",
    a: "Lipid nano-encapsulation has been used in pharmaceutical drug delivery since the 1990s and is approved in cancer therapy and vaccine delivery worldwide. Our nano-carriers are made of food-grade phospholipids (the same material as your cell membranes), making them completely biocompatible and safe for daily use. Every batch undergoes 3rd-party toxicology screening.",
  },
  {
    q: "How quickly will I feel a difference?",
    a: "Because of the higher absorption rate, most TOXNIL customers notice a difference faster than with standard supplements — typically within 2–4 weeks for energy and gut health formulas, and 4–8 weeks for long-term benefits like joint health and heart health. We offer a 30-day money-back guarantee so you can try risk-free.",
  },
  {
    q: "Are TOXNIL products suitable for vegetarians and vegans?",
    a: "Yes. All TOXNIL products use vegetable capsules (HPMC), plant-derived nano-carriers (sunflower or soy lecithin at trace levels), and zero animal-derived ingredients. The full ingredient list is printed on every label — no hidden excipients.",
  },
  {
    q: "Can I take multiple TOXNIL products together?",
    a: "Most of our formulas are designed to stack well together. We recommend starting with one product to assess your response, then adding a second after 2–4 weeks. If you're on prescription medication, please consult your doctor before stacking, as nano-delivery can enhance absorption of everything — including medications.",
  },
]

const TABS = [
  { id: "video", label: "How It Works", icon: Play },
  { id: "science", label: "The Research", icon: BookOpen },
  { id: "ingredients", label: "Ingredients Q&A", icon: Leaf },
]

export function KnowMoreSection() {
  const [activeTab, setActiveTab] = useState("video")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)

  return (
    <section id="know-more" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-4">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Know More</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a4d3e] font-playfair leading-tight">
              Curious How It All<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-[#d4af37]">
                Actually Works?
              </span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              We believe educated customers make better choices. Dive into the science, watch how nano-tech works, and get your questions answered.
            </p>
          </div>
        </ScrollReveal>

        {/* Tab navigation */}
        <ScrollReveal>
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-2xl p-1.5 gap-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === id
                      ? "bg-[#1a4d3e] text-white shadow-md"
                      : "text-gray-500 hover:text-[#1a4d3e]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Video Tab */}
        {activeTab === "video" && (
          <ScrollReveal>
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#0f2e26] to-[#1a4d3e] relative aspect-video max-w-3xl mx-auto">
              {!videoPlaying ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 p-8">
                  {/* Decorative elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-emerald-600/20 blur-2xl" />
                    <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-[#d4af37]/10 blur-3xl" />
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="text-5xl mb-4">⚗️</div>
                    <h3 className="text-2xl font-bold font-playfair mb-2">Watch: How NanoTech Supplements Work</h3>
                    <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                      A 3-minute visual explanation of how nano-encapsulation delivers 10× more of each supplement directly into your cells.
                    </p>
                    {/* Play button */}
                    <button
                      onClick={() => setVideoPlaying(true)}
                      className="group h-20 w-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center mx-auto transition-all hover:scale-110"
                    >
                      <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                    <p className="text-white/40 text-xs mt-4">Video coming soon — our team is currently producing it</p>
                  </div>
                </div>
              ) : (
                // Replace this src with your actual YouTube video embed URL
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="TOXNIL Nanotechnology Explainer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {/* Below video cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: "🔬", title: "Nano-scale precision", desc: "100nm particles — 5,000× smaller than a human hair" },
                { icon: "⚗️", title: "Lipid encapsulation", desc: "Protected by the same material as your cell membranes" },
                { icon: "🎯", title: "Targeted delivery", desc: "Active ingredient reaches bloodstream 10× faster" },
              ].map((card) => (
                <div key={card.title} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">{card.icon}</div>
                  <h4 className="font-bold text-[#1a4d3e] text-sm">{card.title}</h4>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Science / Research Tab */}
        {activeTab === "science" && (
          <ScrollReveal>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "📊",
                  title: "Why Most Supplements Fail",
                  study: "Journal of Pharmaceutical Sciences, 2019",
                  finding: "Average oral supplement bioavailability is 15–25% in healthy adults. The majority of the active compound is excreted unused.",
                  color: "bg-red-50 border-red-100",
                  tag: "bg-red-100 text-red-700",
                  tagLabel: "The Problem",
                },
                {
                  icon: "⚗️",
                  title: "Nano-Encapsulation Solution",
                  study: "Advanced Drug Delivery Reviews, 2021",
                  finding: "Lipid nano-formulations increase the oral bioavailability of poorly soluble compounds by 5–40× compared to conventional formulations.",
                  color: "bg-emerald-50 border-emerald-100",
                  tag: "bg-emerald-100 text-emerald-700",
                  tagLabel: "The Solution",
                },
                {
                  icon: "✅",
                  title: "Safety of Lipid Nano-Carriers",
                  study: "Food & Drug Administration, GRAS Notices",
                  finding: "Phospholipid-based nano-carriers are Generally Recognized as Safe (GRAS) by the FDA. They are biodegradable and metabolised by normal cellular lipid pathways.",
                  color: "bg-sky-50 border-sky-100",
                  tag: "bg-sky-100 text-sky-700",
                  tagLabel: "Safety",
                },
              ].map((card) => (
                <div key={card.title} className={`rounded-2xl p-6 border ${card.color}`}>
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${card.tag}`}>{card.tagLabel}</span>
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="text-base font-bold text-[#1a4d3e] mb-2 font-playfair">{card.title}</h3>
                  <p className="text-xs text-gray-400 italic mb-3">📄 {card.study}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.finding}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-[#1a4d3e]/5 border border-[#1a4d3e]/10 rounded-2xl p-4 text-center">
              <p className="text-gray-500 text-sm">
                All TOXNIL formulas are developed referencing published peer-reviewed research.
                Full references available on product pages. 📋
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* FAQ / Ingredients Tab */}
        {activeTab === "ingredients" && (
          <ScrollReveal>
            <div className="max-w-2xl mx-auto divide-y divide-gray-100 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-[#1a4d3e] text-sm leading-relaxed pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
