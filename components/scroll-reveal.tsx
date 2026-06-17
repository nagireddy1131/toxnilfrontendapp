"use client"

import { useEffect, useRef, ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  stagger?: 1 | 2 | 3 | 4 | 5 | 6
  delay?: number
}

export function ScrollReveal({ children, className = "", stagger, delay }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible")
          observer.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const staggerClass = stagger ? `stagger-${stagger}` : ""
  const inlineDelay = delay ? { transitionDelay: `${delay}ms` } : {}

  return (
    <div ref={ref} className={`reveal-hidden ${staggerClass} ${className}`} style={inlineDelay}>
      {children}
    </div>
  )
}
