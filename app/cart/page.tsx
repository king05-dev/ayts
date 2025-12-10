"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AYTSLogo } from "@/components/ayts-logo"
import {
  ChevronLeft,
  Minus,
  Plus,
  Trash2,
  MapPin,
  User,
  Phone,
  FileText,
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { selectedLocation, cartItems, updateCartQuantity, removeFromCart, clearCart, getCartTotal } = useApp()
  const router = useRouter()

  const [isCheckout, setIsCheckout] = useState(false)
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  })

  useEffect(() => {
    if (!selectedLocation) {
      router.push("/")
    }
  }, [selectedLocation, router])

  const subtotal = getCartTotal()
  const deliveryFee = cartItems.length > 0 ? 25 : 0
  const total = subtotal + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = () => {
    if (formData.name && formData.phone && formData.address) {
      setIsOrderPlaced(true)
    }
  }

  const handleBackToHome = () => {
    clearCart()
    setIsOrderPlaced(false)
    setIsCheckout(false)
    router.push("/categories")
  }

  const isFormValid = formData.name && formData.phone && formData.address

  // Get unique store name from cart items
  const storeName = cartItems.length > 0 ? cartItems[0].storeName : ""

  if (!selectedLocation) {
    return null
  }

  // Order Placed Success Screen
  if (isOrderPlaced) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2 text-center">Your order has been placed!</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-xs">
          The store will contact you shortly to confirm your order.
        </p>
        <div className="bg-muted/50 rounded-2xl p-5 w-full max-w-sm mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">Order Total</span>
            <span className="font-extrabold text-primary text-xl">₱{total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Delivery To</span>
            <span className="font-semibold text-foreground text-sm text-right max-w-[180px] truncate">
              {formData.address}
            </span>
          </div>
        </div>
        <button
          onClick={handleBackToHome}
          className="w-full max-w-sm py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center justify-center"
        >
          Back to Home
        </button>
      </main>
    )
  }

  // Checkout Form Screen
  if (isCheckout) {
    return (
      <main className="min-h-screen bg-background pb-32">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsCheckout(false)}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Checkout</h1>
            <div className="w-10 h-10" />
          </div>
        </header>

        <div className="px-4 py-6">
          {/* Order Summary Card */}
          <div className="bg-muted/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Order Summary</p>
                <p className="text-sm text-muted-foreground">
                  {cartItems.length} items · ₱{total}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {cartItems.slice(0, 4).map((item) => (
                <div key={item.id} className="w-12 h-12 rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {cartItems.length > 4 && (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">+{cartItems.length - 4}</span>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Delivery Information</h2>

            {/* Name Field */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., 0912 345 6789"
                className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Address Field */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="House/Unit No., Street, Barangay, City"
                rows={3}
                className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>

            {/* Notes Field */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Order Notes
                <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special instructions for your order..."
                rows={2}
                className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="mt-8 bg-card rounded-2xl border border-border p-5">
            <h3 className="font-bold text-foreground mb-4">Price Details</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">₱{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-semibold text-foreground">₱{deliveryFee}</span>
              </div>
              <div className="h-px bg-border my-1" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-xl font-extrabold text-primary">₱{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent">
          <button
            onClick={handlePlaceOrder}
            disabled={!isFormValid}
            className={`w-full py-4 font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              isFormValid
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <span>Place Order</span>
            <span className="font-extrabold">· ₱{total}</span>
          </button>
        </div>
      </main>
    )
  }

  // Cart Items Screen
  return (
    <main className="min-h-screen bg-background pb-48">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link
            href="/store/1"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <AYTSLogo className="w-7 h-7" />
            <span className="text-lg font-bold text-foreground">My Cart</span>
          </div>
          <div className="w-10 h-10" />
        </div>
      </header>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">Add items from stores to get started</p>
          <Link
            href="/stores"
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Browse Stores
          </Link>
        </div>
      ) : (
        <>
          {/* Store Info */}
          <div className="px-4 py-4">
            <Link href="/store/1" className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground text-sm">{storeName}</p>
                <p className="text-xs text-muted-foreground">0.3 km away</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>

          {/* Cart Items List */}
          <div className="px-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3">
              Items ({cartItems.length})
            </h2>
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-card rounded-2xl border border-border shadow-sm"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{item.unit}</p>
                    <p className="font-extrabold text-primary">₱{item.price * item.quantity}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </button>
                      <span className="w-8 text-center font-bold text-foreground text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-primary-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Fixed Bottom Summary & CTA */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
          {/* Price Summary Card */}
          <div className="px-4 py-4">
            <div className="bg-muted/50 rounded-2xl p-4">
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Subtotal</span>
                  <span className="font-semibold text-foreground">₱{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Delivery Fee</span>
                  <span className="font-semibold text-foreground">₱{deliveryFee}</span>
                </div>
              </div>
              <div className="h-px bg-border mb-3" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-extrabold text-primary">₱{total}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="px-4 pb-6">
            <button
              onClick={() => setIsCheckout(true)}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              <span>Checkout</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
