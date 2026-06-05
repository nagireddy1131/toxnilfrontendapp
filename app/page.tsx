import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Leaf,
  Shield,
  Sparkles,
  TrendingUp,
  Heart,
  Brain,
  Zap,
  CheckCircle,
  FlaskConical,
  Globe,
  Award,
} from "lucide-react"
import { TrustMarquee } from "@/components/trust-marquee"
import { NanoTechnologySection } from "@/components/nano-technology-section"
import { SiteHeader } from "@/components/site-header"
import { StickyUIElements } from "@/components/sticky-ui-elements"
import { IngredientsCarousel } from "@/components/ingredients-carousel"
import { AnimatedStats } from "@/components/animated-stats"
import { HeroCarousel } from "@/components/hero-carousel"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <StickyUIElements />

      {/* Navigation */}
      <SiteHeader />

      {/* Hero Section — full-width category carousel */}
      <section id="hero" className="w-full px-4 md:px-6">
        <HeroCarousel />
      </section>

      <TrustMarquee />

      {/* Animated Stats Bar */}
      <AnimatedStats />

      {/* Nano Absorption Comparison */}
      <section className="py-16 bg-gradient-to-r from-emerald-950 to-[#1a3d2e] text-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-emerald-300 text-sm font-semibold uppercase tracking-widest">The TOXNIL Difference</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Why Our Supplements Work Better</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                { label: "TOXNIL Nano Formula", pct: 95, color: "bg-emerald-400" },
                { label: "Standard Capsule", pct: 20, color: "bg-gray-400" },
                { label: "Powder Supplement", pct: 30, color: "bg-blue-400" },
                { label: "Regular Tablet", pct: 15, color: "bg-red-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-bold text-emerald-300">{item.pct}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-emerald-200 text-sm mt-4">* Bioavailability absorption rate comparison</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FlaskConical, label: "Nano-Sized", desc: "1–100nm particles" },
                { icon: CheckCircle, label: "10x Absorbed", desc: "vs traditional pills" },
                { icon: Globe, label: "Natural Origin", desc: "Zero synthetic fillers" },
                { icon: Award, label: "Lab Certified", desc: "3rd party tested" },
              ].map((f) => (
                <div key={f.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                  <f.icon className="h-7 w-7 text-emerald-300 mb-2" />
                  <p className="font-bold text-white">{f.label}</p>
                  <p className="text-xs text-emerald-200 mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Shop by Categories</h2>
            <p className="text-lg text-muted-foreground">Find the perfect supplements for your wellness goals</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                name: "Heart Health",
                icon: Heart,
                color: "bg-pink-100 text-pink-700",
                href: "/products?category=heart",
              },
              {
                name: "Immunity",
                icon: Shield,
                color: "bg-orange-100 text-orange-700",
                href: "/products?category=immunity",
              },
              {
                name: "Digestive Health",
                icon: Sparkles,
                color: "bg-blue-100 text-blue-700",
                href: "/products?category=digestive",
              },
              {
                name: "Sleep & Relaxation",
                icon: Brain,
                color: "bg-purple-100 text-purple-700",
                href: "/products?category=sleep",
              },
              {
                name: "Energy",
                icon: Zap,
                color: "bg-yellow-100 text-yellow-700",
                href: "/products?category=energy",
              },
            ].map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div
                      className={`h-16 w-16 rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <category.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="education" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Why Choose TOXNIL?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advanced nanotechnology ensures maximum bioavailability and efficacy
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-4 border-emerald-200">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold">Nano-Enhanced</h3>
              <p className="text-muted-foreground">Advanced nanotechnology for superior cellular absorption</p>
            </Card>
            <Card className="p-6 space-y-4 border-emerald-200">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold">Clinically Tested</h3>
              <p className="text-muted-foreground">Every formula is backed by rigorous scientific research</p>
            </Card>
            <Card className="p-6 space-y-4 border-emerald-200">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold">Natural Ingredients</h3>
              <p className="text-muted-foreground">100% natural, sustainably sourced premium ingredients</p>
            </Card>
            <Card className="p-6 space-y-4 border-emerald-200">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold">Proven Results</h3>
              <p className="text-muted-foreground">Enhanced bioavailability for faster, better results</p>
            </Card>
          </div>
        </div>
      </section>

      <NanoTechnologySection />

      {/* Expert Testimonials */}
      <section id="reviews" className="py-20 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">What Leading Experts Say</h2>
            <p className="text-lg text-muted-foreground">Trusted by healthcare professionals worldwide</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                title: "Functional Medicine Specialist",
                quote:
                  "TOXNIL's nanotechnology approach represents a breakthrough in supplement bioavailability. I confidently recommend their products to my patients.",
                image: "/lab-scientist-working.jpg",
              },
              {
                name: "Dr. Michael Chen",
                title: "Integrative Health Expert",
                quote:
                  "The clinical research behind TOXNIL's formulations is impressive. Their commitment to quality and efficacy sets them apart in the wellness industry.",
                image: "/lab-scientist-working.jpg",
              },
              {
                name: "Dr. Emily Roberts",
                title: "Nutritional Biochemist",
                quote:
                  "I've seen remarkable results with TOXNIL supplements. The nano-enhanced absorption technology delivers real, measurable health improvements.",
                image: "/lab-scientist-working.jpg",
              },
            ].map((expert) => (
              <Card key={expert.name} className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 overflow-hidden">
                    <img
                      src={expert.image || "/placeholder.svg"}
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-900">{expert.name}</h4>
                    <p className="text-sm text-muted-foreground">{expert.title}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">&ldquo;{expert.quote}&rdquo;</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Featured Products</h2>
            <p className="text-lg text-muted-foreground">Discover our most popular wellness solutions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(await (async () => {
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/products?limit=3`, { cache: 'no-store' });
                const data = await res.json();
                const allProducts = Array.isArray(data) ? data : (data.products || []);
                // Take top 3 products or random 3
                return allProducts.slice(0, 3).map((product: any) => ({
                  ...product,
                  id: product._id, // Map _id to id for local usage if needed, or use _id
                }));
              } catch (e) {
                console.error("Failed to fetch products", e);
                return [];
              }
            })()).map((product: any) => (
              <Card
                key={product._id || product.id}
                className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow relative"
              >
                {/* Discount Badge */}
                {product.originalPrice && product.price < product.originalPrice && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
                <Link href={`/products/${product._id || product.id}`} className="block">
                  <div className="aspect-square overflow-hidden bg-emerald-50">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-6 space-y-3">
                  <p className="text-sm text-emerald-700 font-medium">{product.category}</p>
                  <Link href={`/products/${product._id || product.id}`} className="block">
                    <h3 className="text-xl font-semibold hover:text-emerald-700 transition-colors">{product.name}</h3>
                  </Link>
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{product.rating}/5.0</span>
                    <span className="text-sm text-gray-400">({product.reviewCount?.toLocaleString() || product.reviews}) reviews</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-800">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <Link href={`/products/${product._id || product.id}`}>
                      <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                        Add to Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <IngredientsCarousel />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Wellness Insights</h2>
            <p className="text-lg text-muted-foreground">Latest research and tips for optimal health</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Understanding Nanotechnology in Supplements",
                excerpt:
                  "Discover how nano-enhanced formulations revolutionize nutrient absorption and bioavailability for better health outcomes.",
                image: "/wellness-lifestyle-yoga.jpg",
                category: "Science",
              },
              {
                title: "5 Signs Your Body Needs Better Nutrients",
                excerpt:
                  "Learn to recognize the subtle signals that indicate your body needs enhanced nutritional support through quality supplementation.",
                image: "/immune-health-fruits.jpg",
                category: "Health Tips",
              },
              {
                title: "The Complete Guide to Heart Health",
                excerpt:
                  "Expert advice on maintaining cardiovascular wellness through proper nutrition, supplements, and lifestyle choices.",
                image: "/heart-health-running.jpg",
                category: "Wellness",
              },
            ].map((article) => (
              <Card key={article.title} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden bg-emerald-50">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-sm text-emerald-700 font-medium">{article.category}</p>
                  <h3 className="text-xl font-semibold line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-emerald-700 font-medium hover:text-emerald-800"
                  >
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>



      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-emerald-900">Available On</h3>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="px-6 py-3 bg-white rounded-lg shadow-sm">
                <span className="text-lg font-bold text-gray-800">Amazon</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-lg shadow-sm">
                <span className="text-lg font-bold text-gray-800">Flipkart</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-lg shadow-sm">
                <span className="text-lg font-bold text-gray-800">HealthKart</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-lg shadow-sm">
                <span className="text-lg font-bold text-gray-800">Nykaa</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-lg shadow-sm">
                <span className="text-lg font-bold text-gray-800">1mg</span>
              </div>
            </div>
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
                <li>
                  <Link href="/products?category=immunity" className="hover:text-white">
                    Immunity
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=energy" className="hover:text-white">
                    Energy
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
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-white">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-sm text-emerald-300">
            &copy; {new Date().getFullYear()} TOXNIL. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
