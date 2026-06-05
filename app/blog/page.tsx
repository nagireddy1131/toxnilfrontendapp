import { SiteHeader } from "@/components/site-header"
import { Leaf, Clock, Heart, Zap, Moon, Dumbbell, Apple, Brain, Link } from "lucide-react"

const posts = [
  {
    slug: "power-of-natural-supplements",
    category: "Nutrition",
    categoryColor: "bg-emerald-100 text-emerald-800",
    icon: <Leaf className="h-5 w-5" />,
    title: "The Power of Natural Supplements for Everyday Wellness",
    excerpt: "Discover how plant-based nutrients and nanotechnology combine to give your body what it needs — at the cellular level. From turmeric to omega-3s, science has confirmed what nature knew all along.",
    readTime: "5 min read",
    date: "May 28, 2026",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    slug: "boost-immunity-naturally",
    category: "Immunity",
    categoryColor: "bg-orange-100 text-orange-800",
    icon: <Heart className="h-5 w-5" />,
    title: "5 Proven Ways to Boost Your Immune System Naturally",
    excerpt: "Your immune system is your body's first line of defence. Learn how the right combination of Vitamin D, Zinc, and probiotics can dramatically improve your immune response — especially during seasonal changes.",
    readTime: "6 min read",
    date: "May 22, 2026",
    gradient: "from-orange-400 to-red-400",
  },
  {
    slug: "energy-without-caffeine",
    category: "Energy",
    categoryColor: "bg-yellow-100 text-yellow-800",
    icon: <Zap className="h-5 w-5" />,
    title: "Sustainable Energy: How to Stay Active Without Coffee",
    excerpt: "Caffeine is not the only solution. Explore how CoQ10, iron, and B-vitamin complexes support your mitochondria — your body's natural power plants — for all-day energy without the crash.",
    readTime: "4 min read",
    date: "May 15, 2026",
    gradient: "from-yellow-400 to-amber-500",
  },
  {
    slug: "sleep-science",
    category: "Sleep",
    categoryColor: "bg-purple-100 text-purple-800",
    icon: <Moon className="h-5 w-5" />,
    title: "The Science of Sleep: Why Magnesium is Your Best Friend",
    excerpt: "Nearly 70% of adults are deficient in magnesium — a mineral essential for sleep, muscle recovery, and nervous system regulation. Here's why supplementing it can transform your nights.",
    readTime: "7 min read",
    date: "May 10, 2026",
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    slug: "anti-inflammatory-diet",
    category: "Anti-Inflammation",
    categoryColor: "bg-red-100 text-red-800",
    icon: <Apple className="h-5 w-5" />,
    title: "Fight Inflammation from the Inside Out",
    excerpt: "Chronic inflammation is linked to almost every major disease. Curcumin from turmeric, omega-3 fatty acids from fish oil, and antioxidant-rich foods are your most powerful tools to fight back.",
    readTime: "8 min read",
    date: "May 3, 2026",
    gradient: "from-red-400 to-rose-500",
  },
  {
    slug: "brain-health-supplements",
    category: "Brain Health",
    categoryColor: "bg-blue-100 text-blue-800",
    icon: <Brain className="h-5 w-5" />,
    title: "Sharpen Your Mind: Top Supplements for Brain Health",
    excerpt: "Mental clarity, focus, and memory are not just about how much sleep you get. Omega-3 DHA, CoQ10, and lion's mane mushroom extracts support neuroplasticity and cognitive function in measurable ways.",
    readTime: "6 min read",
    date: "Apr 28, 2026",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    slug: "workout-recovery",
    category: "Fitness",
    categoryColor: "bg-teal-100 text-teal-800",
    icon: <Dumbbell className="h-5 w-5" />,
    title: "Recover Faster: Supplements Every Active Person Needs",
    excerpt: "Hard workouts break your muscles down — recovery is where the growth happens. Magnesium, protein, and anti-inflammatory compounds help your body repair faster and come back stronger.",
    readTime: "5 min read",
    date: "Apr 20, 2026",
    gradient: "from-teal-400 to-green-500",
  },
  {
    slug: "gut-health-guide",
    category: "Digestion",
    categoryColor: "bg-lime-100 text-lime-800",
    icon: <Heart className="h-5 w-5" />,
    title: "Your Gut Is Your Second Brain — Here's How to Heal It",
    excerpt: "The gut-brain axis connects your digestive health directly to your mood, immunity, and energy. Probiotics, prebiotics, and digestive enzymes are the foundation of a healthy microbiome.",
    readTime: "7 min read",
    date: "Apr 14, 2026",
    gradient: "from-lime-400 to-green-400",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a4d3e] via-[#2d6a5a] to-[#1a4d3e] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="h-4 w-4" /> Wellness Journal
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Live Healthier,<br />
            <span className="text-emerald-300">Feel Better Every Day</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Expert articles on nutrition, immunity, energy, sleep, and everything in between — backed by science, written for real people.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container mx-auto px-4 -mt-8 mb-16 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className={`bg-gradient-to-br ${posts[0].gradient} p-12 flex flex-col items-center justify-center text-white min-h-[280px]`}>
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Leaf className="h-10 w-10 text-white" />
              </div>
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">{posts[0].category}</span>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Featured Post</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{posts[0].title}</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">{posts[0].excerpt}</p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{posts[0].readTime}</span>
                <span>•</span>
                <span>{posts[0].date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Articles Grid */}
      <section className="container mx-auto px-4 pb-20 max-w-6xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">All Articles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <div key={post.slug} className="group">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                {/* Card Header Gradient */}
                <div className={`bg-gradient-to-br ${post.gradient} h-32 flex items-center justify-center`}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    {post.icon}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${post.categoryColor} mb-3 self-start`}>
                    {post.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex-1 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#1a4d3e] text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Leaf className="h-10 w-10 text-emerald-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Stay Ahead of Your Health</h2>
          <p className="text-white/70 mb-8">Get our latest wellness articles and product updates delivered to you.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none focus:ring-2 ring-emerald-400"
            />
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-white py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-lg">TOXNIL</span>
          </div>
          <p className="text-emerald-200">© {new Date().getFullYear()} TOXNIL. All rights reserved.</p>
          <div className="flex gap-6 text-emerald-300">
            <Link href="/products" className="hover:text-white">Shop</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
