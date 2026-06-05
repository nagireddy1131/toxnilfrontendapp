import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Leaf, Microscope, Users, Award, Heart } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6 text-balance">
            Pioneering Wellness Through Nanotechnology
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            At TOXNIL, we're revolutionizing health supplements with advanced nanotechnology to deliver superior
            bioavailability and efficacy. Our mission is to help you achieve optimal wellness naturally.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, TOXNIL emerged from a simple yet powerful question: Why do so many supplements fail
                  to deliver on their promises? The answer lies in bioavailability - the body's ability to absorb and
                  utilize nutrients.
                </p>
                <p>
                  Our team of scientists and wellness experts spent years researching advanced nanotechnology
                  applications in nutritional science. The result? A revolutionary approach that increases nutrient
                  absorption by up to 10 times compared to traditional supplements.
                </p>
                <p>
                  Today, TOXNIL stands at the forefront of wellness innovation, helping thousands of people achieve
                  their health goals through scientifically advanced, naturally-derived supplements.
                </p>
              </div>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
              <img
                src="/nanotechnology.png"
                alt="Nanotechnology nanoparticles delivering nutrients at cellular level"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent flex items-end p-6">
                <p className="text-white text-sm font-medium opacity-90">
                  🔬 Nano-particles delivering nutrients at cellular level — 1–100nm precision
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at TOXNIL
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 space-y-4 text-center border-emerald-200">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <Microscope className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold">Science-Driven</h3>
              <p className="text-muted-foreground">Every formula is backed by rigorous research and clinical testing</p>
            </Card>
            <Card className="p-6 space-y-4 text-center border-emerald-200">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <Leaf className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold">Natural First</h3>
              <p className="text-muted-foreground">We use only premium, sustainably sourced natural ingredients</p>
            </Card>
            <Card className="p-6 space-y-4 text-center border-emerald-200">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold">Customer Focus</h3>
              <p className="text-muted-foreground">Your health and satisfaction are our top priorities</p>
            </Card>
            <Card className="p-6 space-y-4 text-center border-emerald-200">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold">Quality Excellence</h3>
              <p className="text-muted-foreground">We maintain the highest standards in every product we create</p>
            </Card>
          </div>
        </div>
      </section>

      {/* The Science */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6 text-center">
              The Science Behind TOXNIL
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Traditional supplements often suffer from poor absorption rates. Your body can only utilize a small
                fraction of the nutrients in standard formulations, meaning most of what you take simply passes through
                your system.
              </p>
              <p>
                TOXNIL's nanotechnology solution reduces particle sizes to the nano-scale (1-100 nanometers), making
                nutrients dramatically more bioavailable. These microscopic particles can:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cross cellular membranes more easily</li>
                <li>Dissolve and absorb faster in the digestive system</li>
                <li>Reach target tissues more effectively</li>
                <li>Remain active in the body for longer periods</li>
              </ul>
              <p>
                The result is up to 10 times better absorption compared to traditional supplements, meaning you get more
                benefit from every dose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-background">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-16 w-16 text-emerald-700 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">Ready to Transform Your Wellness?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the TOXNIL difference with our advanced nanotechnology formulas
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800">
                Shop Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-emerald-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6" />
                <span className="text-xl font-bold">TOXNIL</span>
              </div>
              <p className="text-emerald-200 text-sm">Advanced nanotechnology wellness for a healthier tomorrow</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                <li>
                  <Link href="/products" className="hover:text-white">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-sm text-emerald-200">
            <p>&copy; 2026 TOXNIL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
