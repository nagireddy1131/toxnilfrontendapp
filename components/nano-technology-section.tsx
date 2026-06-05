import { Card } from "@/components/ui/card"
import { Leaf, Droplet, Sparkles, Package, Shield } from "lucide-react"

export function NanoTechnologySection() {
  const steps = [
    {
      step: 1,
      icon: Leaf,
      title: "Premium Sourcing",
      description:
        "We select the finest ingredients from pristine farms worldwide, prioritizing quality and purity. Wild-grown plants from Himalayan, Northeast, and Southern regions ensure optimal potency.",
    },
    {
      step: 2,
      icon: Droplet,
      title: "Aqueous Extraction",
      description:
        "Our eco-friendly aqueous extraction process maximizes bioactive compounds without chemical residues. This Zero Harm technology ensures both effectiveness and environmental safety.",
    },
    {
      step: 3,
      icon: Sparkles,
      title: "Nanotechnology Enhancement",
      description:
        "Cutting-edge patent-pending nanotechnology transforms ingredients into ultra-small particles with enhanced solubility, bioavailability, and stability for superior absorption.",
    },
    {
      step: 4,
      icon: Shield,
      title: "Smart Encapsulation",
      description:
        "Nano-encapsulation protects active ingredients and ensures targeted delivery to specific sites in the body. This enhances uptake at cellular surfaces for maximum effectiveness.",
    },
    {
      step: 5,
      icon: Package,
      title: "Quality Packaging",
      description:
        "Premium glass bottles preserve tablet efficacy and maintain hygiene, especially in challenging environmental conditions. Sustainable packaging reflects our commitment to the planet.",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">What is Our Patented Nano-Technology?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Most supplements fail to deliver full benefits due to poor absorption. TOXNIL's nanotechnology solves this
            by converting nutrients into ultra-small, nano-sized particles for faster absorption and higher
            bioavailability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {steps.map((item) => (
            <Card key={item.step} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <item.icon className="h-7 w-7 text-emerald-700" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-emerald-700 uppercase">Step {item.step}</p>
                <h3 className="text-lg font-bold text-emerald-900">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="bg-emerald-100 rounded-2xl p-8 md:p-12 text-center space-y-4">
          <h3 className="text-2xl font-bold text-emerald-900">The TOXNIL Difference</h3>
          <p className="text-emerald-800 max-w-3xl mx-auto leading-relaxed">
            Our nano-tablets dissolve only at pH 6-7.5, ensuring controlled release in the duodenum—the ideal absorption
            site. This means maximum nutrient delivery with a lower dosage, boosting efficiency and delivering real
            results you can feel.
          </p>
        </div>
      </div>
    </section>
  )
}
