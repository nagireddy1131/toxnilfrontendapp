import { ToxnilLogo } from "@/components/toxnil-logo"

export default function LogoShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sage-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#1a4d3e] mb-4 font-serif">TOXNIL Brand Logo</h1>
        <p className="text-center text-[#5A7A77] mb-16 max-w-2xl mx-auto">
          Premium nanotechnology supplement brand identity featuring a stylized leaf with nano-particles, representing
          natural wellness enhanced by advanced science.
        </p>

        {/* Logo Variants Section */}
        <div className="grid gap-16">
          {/* Full Logo - Stacked */}
          <section className="bg-white rounded-2xl shadow-lg p-12 border border-emerald-100">
            <h2 className="text-xl font-semibold text-[#1a4d3e] mb-8">Full Logo (Stacked)</h2>
            <div className="flex flex-wrap items-end justify-center gap-12">
              <div className="text-center">
                <ToxnilLogo variant="full" size="sm" />
                <p className="mt-4 text-sm text-gray-500">Small</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="full" size="md" />
                <p className="mt-4 text-sm text-gray-500">Medium</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="full" size="lg" />
                <p className="mt-4 text-sm text-gray-500">Large</p>
              </div>
            </div>
          </section>

          {/* Horizontal Logo */}
          <section className="bg-white rounded-2xl shadow-lg p-12 border border-emerald-100">
            <h2 className="text-xl font-semibold text-[#1a4d3e] mb-8">Horizontal Logo</h2>
            <div className="flex flex-wrap items-center justify-center gap-12">
              <div className="text-center">
                <ToxnilLogo variant="horizontal" size="sm" />
                <p className="mt-4 text-sm text-gray-500">Small</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="horizontal" size="md" />
                <p className="mt-4 text-sm text-gray-500">Medium</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="horizontal" size="lg" />
                <p className="mt-4 text-sm text-gray-500">Large</p>
              </div>
            </div>
          </section>

          {/* Icon Only */}
          <section className="bg-white rounded-2xl shadow-lg p-12 border border-emerald-100">
            <h2 className="text-xl font-semibold text-[#1a4d3e] mb-8">Icon Only (Favicon / App Icon)</h2>
            <div className="flex flex-wrap items-end justify-center gap-12">
              <div className="text-center">
                <ToxnilLogo variant="icon" size="sm" />
                <p className="mt-4 text-sm text-gray-500">32px (Favicon)</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="icon" size="md" />
                <p className="mt-4 text-sm text-gray-500">48px</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="icon" size="lg" />
                <p className="mt-4 text-sm text-gray-500">64px</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="icon" size="xl" />
                <p className="mt-4 text-sm text-gray-500">96px</p>
              </div>
            </div>
          </section>

          {/* Dark Mode Versions */}
          <section className="bg-[#1a4d3e] rounded-2xl shadow-lg p-12">
            <h2 className="text-xl font-semibold text-white mb-8">Dark Mode Versions</h2>
            <div className="flex flex-wrap items-end justify-center gap-16">
              <div className="text-center">
                <ToxnilLogo variant="icon" size="lg" darkMode />
                <p className="mt-4 text-sm text-emerald-200">Icon</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="full" size="md" darkMode />
                <p className="mt-4 text-sm text-emerald-200">Full</p>
              </div>
              <div className="text-center">
                <ToxnilLogo variant="horizontal" size="md" darkMode />
                <p className="mt-4 text-sm text-emerald-200">Horizontal</p>
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="bg-white rounded-2xl shadow-lg p-12 border border-emerald-100">
            <h2 className="text-xl font-semibold text-[#1a4d3e] mb-8">Usage Examples</h2>

            {/* Header Example */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-4">Header Navigation</p>
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <ToxnilLogo variant="horizontal" size="sm" />
                <div className="flex gap-6 text-sm text-[#1a4d3e]">
                  <span>Products</span>
                  <span>About</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>

            {/* Footer Example */}
            <div className="p-4 bg-[#1a4d3e] rounded-lg">
              <p className="text-sm text-emerald-200 mb-4">Footer</p>
              <div className="flex items-center gap-4">
                <ToxnilLogo variant="icon" size="md" darkMode />
                <div className="text-emerald-100 text-sm">
                  <p className="font-semibold">TOXNIL</p>
                  <p className="opacity-70">Advanced Nano Wellness</p>
                </div>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="bg-white rounded-2xl shadow-lg p-12 border border-emerald-100">
            <h2 className="text-xl font-semibold text-[#1a4d3e] mb-8">Brand Color Palette</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-xl bg-[#1a4d3e] shadow-lg mb-3" />
                <p className="text-xs font-medium text-gray-700">Forest Green</p>
                <p className="text-xs text-gray-400">#1a4d3e</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-xl bg-[#2d6a4f] shadow-lg mb-3" />
                <p className="text-xs font-medium text-gray-700">Accent Green</p>
                <p className="text-xs text-gray-400">#2d6a4f</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-xl bg-[#5A7A77] shadow-lg mb-3" />
                <p className="text-xs font-medium text-gray-700">Sage Green</p>
                <p className="text-xs text-gray-400">#5A7A77</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-xl bg-[#D4AF37] shadow-lg mb-3" />
                <p className="text-xs font-medium text-gray-700">Gold</p>
                <p className="text-xs text-gray-400">#D4AF37</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
