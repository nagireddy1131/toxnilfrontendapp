"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Leaf, Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { SiteHeader } from "@/components/site-header"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    })
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="min-h-screen">
      <Toaster />
      <SiteHeader />

      {/* Page Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">Get In Touch</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or nanotechnology? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                  <p className="text-muted-foreground">support@toxnil.com</p>
                  <p className="text-muted-foreground">info@toxnil.com</p>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                  <p className="text-muted-foreground">1-800-TOXNIL-1</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri, 9am-6pm EST</p>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">123 Wellness Boulevard</p>
                  <p className="text-muted-foreground">San Francisco, CA 94102</p>
                  <p className="text-muted-foreground">United States</p>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" size="lg">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">What is nanotechnology in supplements?</h3>
                <p className="text-muted-foreground">
                  Nanotechnology reduces nutrient particles to nano-scale sizes (1-100 nanometers), dramatically
                  improving absorption and bioavailability compared to traditional supplements.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Are TOXNIL products safe?</h3>
                <p className="text-muted-foreground">
                  Yes! All our products undergo rigorous testing and are manufactured in FDA-registered facilities. We
                  use only natural ingredients enhanced with safe nanotechnology.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">How long does shipping take?</h3>
                <p className="text-muted-foreground">
                  Standard shipping takes 3-5 business days. We offer free shipping on orders over ₹999. Express shipping
                  options are available at checkout.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">What is your return policy?</h3>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact us for a
                  full refund.
                </p>
              </Card>
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
