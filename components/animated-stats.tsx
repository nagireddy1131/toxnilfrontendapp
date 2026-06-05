"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Package, Star, Award } from "lucide-react"

function useCountUp(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, started])

  return count
}

const stats = [
  { icon: Users, label: "Happy Customers", value: 12500, suffix: "+", color: "text-emerald-600" },
  { icon: Package, label: "Products Sold", value: 48000, suffix: "+", color: "text-blue-600" },
  { icon: Star, label: "5-Star Reviews", value: 9800, suffix: "+", color: "text-amber-500" },
  { icon: Award, label: "Years of Research", value: 5, suffix: "+", color: "text-purple-600" },
]

export function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-14 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const StatIcon = stat.icon
            return (
              <StatItem key={stat.label} stat={stat} StatIcon={StatIcon} visible={visible} />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StatItem({ stat, StatIcon, visible }: { stat: typeof stats[0]; StatIcon: any; visible: boolean }) {
  const count = useCountUp(stat.value, 2200, visible)
  return (
    <div className="flex flex-col items-center text-center group">
      <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-gray-100`}>
        <StatIcon className={`h-7 w-7 ${stat.color}`} />
      </div>
      <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
        {count.toLocaleString('en-IN')}{stat.suffix}
      </p>
      <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
    </div>
  )
}
