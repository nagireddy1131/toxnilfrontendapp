"use client"

import { useState, useEffect, useRef } from "react"

const PRODUCTS = [
  { src: "/immunity_bundle.png",               alt: "Daily Detox Formula" },
  { src: "/coq10-supplement.png",              alt: "CoQ10 Advanced" },
  { src: "/omega-3-fish-oil-bottle.png",       alt: "Bio-Enhanced Omega-3" },
  { src: "/magnesium-supplement.png",          alt: "Magnesium Complex" },
  { src: "/probiotic-supplement.png",          alt: "Probiotic Elite" },
  { src: "/vitamin-d3-supplement.png",         alt: "Nano Vitamin D3" },
  { src: "/multivitamin-supplement-bottle.png",alt: "Advanced Multivitamin" },
  { src: "/curcumin-supplement-bottle.png",    alt: "Nano Curcumin Plus" },
  { src: "/iron-supplement.png",               alt: "Nano Iron Plus" },
]

export function HeroProductSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (index: number, dir: "next" | "prev" = "next") => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 450)
  }

  const goNext = () => goTo((current + 1) % PRODUCTS.length, "next")
  const goPrev = () => goTo((current - 1 + PRODUCTS.length) % PRODUCTS.length, "prev")

  // Auto-advance every 3s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goNext()
    }, 3000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, animating])

  // Determine which images to show (prev, current, next) for the strip effect
  const indices = [
    (current - 1 + PRODUCTS.length) % PRODUCTS.length,
    current,
    (current + 1) % PRODUCTS.length,
    (current + 2) % PRODUCTS.length,
  ]

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* Main focal product */}
      <div className="relative w-full flex items-end justify-center gap-3 md:gap-5 px-2">

        {/* Strip of 4 products sliding in */}
        {indices.map((idx, pos) => {
          const isCenter = pos === 1
          const scale = isCenter ? "scale-100" : pos === 0 ? "scale-75 opacity-50" : "scale-85 opacity-70"
          const zIndex = isCenter ? "z-20" : pos === 0 ? "z-10" : "z-10"
          const translateX = animating
            ? direction === "next"
              ? `translateX(-${pos === 0 ? 110 : 0}%)`
              : `translateX(${pos === 3 ? 110 : 0}%)`
            : "translateX(0%)"

          return (
            <div
              key={`${idx}-${pos}`}
              className={`
                relative transition-all duration-450 ease-in-out
                ${zIndex}
                ${pos === 0 ? "hidden md:block w-[18%] opacity-40" : ""}
                ${pos === 1 ? "w-[48%] md:w-[44%]" : ""}
                ${pos === 2 ? "w-[28%] md:w-[26%] opacity-60" : ""}
                ${pos === 3 ? "hidden md:block w-[14%] opacity-30" : ""}
              `}
              style={{ transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              <div
                className={`
                  relative transition-all duration-450
                  ${isCenter ? "drop-shadow-[0_20px_40px_rgba(26,77,62,0.25)]" : "drop-shadow-none"}
                `}
                style={{ transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease" }}
              >
                <img
                  src={PRODUCTS[idx].src}
                  alt={PRODUCTS[idx].alt}
                  className="w-full h-auto object-contain"
                  draggable={false}
                />
                {/* Soft reflection under center bottle */}
                {isCenter && (
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60%] h-5 rounded-full blur-md opacity-30"
                    style={{ background: "radial-gradient(ellipse, rgba(26,77,62,0.5) 0%, transparent 70%)" }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2 mt-5">
        {PRODUCTS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            className={`rounded-full transition-all duration-300 focus:outline-none ${
              i === current
                ? "w-6 h-2.5 bg-emerald-700"
                : "w-2.5 h-2.5 bg-emerald-200 hover:bg-emerald-400"
            }`}
            aria-label={`Go to ${PRODUCTS[i].alt}`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-[45%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow-md flex items-center justify-center text-emerald-800 hover:bg-white hover:scale-110 transition-all z-30"
        aria-label="Previous product"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 top-[45%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow-md flex items-center justify-center text-emerald-800 hover:bg-white hover:scale-110 transition-all z-30"
        aria-label="Next product"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}
