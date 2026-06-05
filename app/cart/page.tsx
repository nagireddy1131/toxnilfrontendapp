"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Minus, Trash2, ArrowRight, Leaf, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart-provider"
import { SiteHeader } from "@/components/site-header"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal, cartCount } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const shipping = subtotal > 999 ? 0 : 99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-emerald-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to get started</p>
              <Link href="/products">
                <Button className="bg-emerald-700 hover:bg-emerald-800">Shop Products</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-emerald-50 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <Link href={`/products/${item.id}`}>
                              <h3 className="font-semibold text-lg hover:text-emerald-700">{item.name}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-xl font-bold text-emerald-800">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 space-y-6 sticky top-24">
                  <h2 className="text-2xl font-bold">Order Summary</h2>

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    <Button variant="outline" className="w-full bg-transparent">
                      Apply
                    </Button>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    {shipping === 0 && <p className="text-sm text-emerald-700">You saved ₹99 on shipping!</p>}
                    {shipping > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add ₹{(999 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-xl font-bold mb-6">
                      <span>Total</span>
                      <span className="text-emerald-800">₹{total.toFixed(2)}</span>
                    </div>
                    <Button 
                      className="w-full bg-emerald-700 hover:bg-emerald-800" 
                      size="lg"
                      onClick={() => {
                        const userInfo = localStorage.getItem("userInfo")
                        if (userInfo) {
                          window.location.href = "/checkout"
                        } else {
                          window.location.href = "/login?redirect=/checkout"
                        }
                      }}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  <Link href="/products" className="block text-center text-sm text-emerald-700 hover:underline">
                    Continue Shopping
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-emerald-950 text-white py-12 mt-12">
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
