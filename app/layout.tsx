import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Montserrat, Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AIChatbot } from "@/components/ai-chatbot"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "TOXNIL - Advanced Nanotechnology Wellness",
  description:
    "Experience superior bioavailable supplements with advanced nanotechnology. Natural ingredients, clinically tested, maximum efficacy.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
        <AIChatbot />
        <Analytics />
      </body>
    </html>
  )
}
