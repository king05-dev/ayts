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
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"
import { api, Cart, CartItem, Store } from "@/lib/api"
// Simple Badge component inline
const Badge = ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${className}`}>
    {children}
  </span>
)

export default function CartPage() {
  const { selectedLocation, cartItems, updateCartQuantity, getCartTotal, getCartItemCount, clearCart } = useApp()
  const router = useRouter()

  const [isCheckout, setIsCheckout] = useState(false)
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  })

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  useEffect(() => {
    getUserLocation()
  }, [])

  // Group cart items by store
  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = {
        storeId: item.storeId,
        storeName: item.storeName,
        items: []
      }
    }
    acc[item.storeId].items.push(item)
    return acc
  }, {} as Record<string, { storeId: string, storeName: string, items: typeof cartItems }>)

  const stores = Object.values(groupedCartItems)
  const totalItems = getCartItemCount()
  const totalPrice = getCartTotal()

  // Remove location check and API fetching since we're using app context
  // useEffect(() => {
  //   if (!selectedLocation) {
  //     router.push("/")
  //   }
  // }, [selectedLocation, router])

  const handleUpdateQuantity = (itemId: string | number, change: number) => {
    const item = cartItems.find(item => item.id === itemId)
    if (!item) return
    
    updateCartQuantity(itemId, change)
  }

  const handleRemoveItem = (itemId: string | number) => {
    const item = cartItems.find(item => item.id === itemId)
    if (!item) return
    
    updateCartQuantity(itemId, -item.quantity)
  }

  const handleClearCart = () => {
    clearCart()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const createOrder = async () => {
    if (stores.length === 0) return

    try {
      setLoading(true)
      const response = await api.createOrder({
        storeId: stores[0].storeId,
        deliveryAddress: formData.address,
        deliveryInstructions: formData.notes,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: '',
        orderNotes: formData.notes,
        paymentMethod: 'cash_on_delivery',
      })

      if (response.success && response.data) {
        setIsOrderPlaced(true)
      }
    } catch (error) {
      console.error('Failed to create order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = () => {
    if (formData.name && formData.phone && formData.address) {
      createOrder()
    }
  }

  const handleBackToHome = () => {
    clearCart()
    setIsOrderPlaced(false)
    setIsCheckout(false)
    router.push("/categories")
  }

  const isFormValid = formData.name && formData.phone && formData.address

  // Get store name from first cart item
  const storeName = stores.length > 0 ? stores[0].storeName : ""

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
            <span className="font-extrabold text-primary text-xl">₱{totalPrice + 50}</span>
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
                  {totalItems} items · ₱{totalPrice + 50}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {cartItems.slice(0, 4).map((item) => (
                <div key={item.id} className="w-12 h-12 rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name || "Product"}
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
                <span className="font-semibold text-foreground">₱{totalPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-semibold text-foreground">₱50.00</span>
              </div>
              <div className="h-px bg-border my-1" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-xl font-extrabold text-primary">₱{totalPrice + 50}</span>
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
            <span className="font-extrabold">· ₱{totalPrice + 50}</span>
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

           
          href={stores.length > 0 ? `/stores/${stores[0].storeId}` : "/stores"}
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
          {/* Cart Items by Store */}
          {stores.map((store) => (
            <div key={store.storeId} className="px-4 py-4">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
                <Link href={`/stores/${store.storeId}`} className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-lg">{store.storeName}</p>
                    <p className="text-sm text-muted-foreground">Your neighborhood store</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>

                {/* Cart Items */}
                <div className="space-y-3">
                  {store.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-background rounded-xl">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-primary font-bold">₱{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Location Section */}
          <div className="px-4 py-4">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Location
              </h3>
              {userLocation ? (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Location found: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
                  <button
                    onClick={getUserLocation}
                    className="ml-auto px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Update PIN
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Getting your location...</span>
                  <button
                    onClick={getUserLocation}
                    className="ml-auto px-3 py-1 bg-muted text-foreground text-xs rounded-full hover:bg-muted/80 transition-colors"
                  >
                    Enable Location
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="px-4 py-4">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
              <h3 className="font-bold text-foreground mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-background rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Cash on Delivery (COD)</p>
                    <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-4 py-4">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
              <h3 className="font-bold text-foreground mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₱{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₱50.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₱{totalPrice + 50}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
