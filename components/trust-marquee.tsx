export function TrustMarquee() {
  const badges = [
    { icon: "✨", text: "Advanced Nanotechnology" },
    { icon: "🔬", text: "Clinically Proven" },
    { icon: "🛡️", text: "No Side Effects" },
    { icon: "💯", text: "100% Bioavailable" },
  ]

  return (
    <div className="bg-emerald-900 py-8 overflow-hidden">
      <div className="relative flex">
        <div className="flex animate-marquee space-x-16 whitespace-nowrap">
          {[...badges, ...badges, ...badges].map((badge, index) => (
            <div key={index} className="flex items-center gap-3 text-white">
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-lg font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 flex animate-marquee2 space-x-16 whitespace-nowrap">
          {[...badges, ...badges, ...badges].map((badge, index) => (
            <div key={index} className="flex items-center gap-3 text-white">
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-lg font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
