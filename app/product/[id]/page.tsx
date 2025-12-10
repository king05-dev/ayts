"use client"

import { useState, useEffect } from "react"
import { AYTSLogo } from "@/components/ayts-logo"
import { ChevronLeft, Minus, Plus, ShoppingCart, Store, Truck, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"

const productData = {
  id: 1,
  name: "Fresh Organic Bananas",
  price: 45,
  unit: "per kg",
  description:
    "Premium quality organic bananas sourced directly from local farms. These bananas are naturally ripened and free from any artificial chemicals or preservatives. Perfect for smoothies, baking, or enjoying as a healthy snack.",
  image: "/fresh-yellow-bananas.jpg",
  store: {
    id: 1,
    name: "Fresh Mart Grocery",
    distance: "0.3 km",
  },
  inStock: true,
  deliveryNotes: "Same-day delivery available for orders before 2 PM",
}

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { selectedLocation, addToCart, getCartItemCount } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!selectedLocation) {
      router.push("/")
    }
  }, [selectedLocation, router])

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        unit: productData.unit,
        image: productData.image,
        storeId: productData.store.id,
        storeName: productData.store.name,
      })
    }
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const totalPrice = productData.price * quantity
  const cartItemCount = getCartItemCount()

  if (!selectedLocation) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-32">
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
            <span className="text-sm font-bold text-primary">AYTS</span>
          </div>
          <Link
            href="/cart"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Large Product Image */}
      <div className="px-6 pt-6">
        <div className="aspect-square relative bg-muted rounded-3xl overflow-hidden shadow-sm">
          <Image
            src={productData.image || "/placeholder.svg"}
            alt={productData.name}
            fill
            className="object-cover"
            priority
          />
          {productData.inStock && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              In Stock
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-6 pt-8">
        {/* Name & Price */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-foreground mb-2 text-balance">{productData.name}</h1>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary">₱{productData.price}</span>
            <span className="text-muted-foreground text-sm">{productData.unit}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Description</h2>
          <p className="text-muted-foreground leading-relaxed">{productData.description}</p>
        </div>

        {/* Quantity Stepper */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Quantity</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-muted rounded-2xl p-1.5">
              <button
                onClick={decrementQuantity}
                className="w-12 h-12 rounded-xl bg-card flex items-center justify-center hover:bg-card/80 transition-colors shadow-sm border border-border"
              >
                <Minus className="w-5 h-5 text-foreground" />
              </button>
              <span className="w-16 text-center text-xl font-extrabold text-foreground">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-extrabold text-foreground">₱{totalPrice}</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-3">
          {/* Store Info */}
          <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">Sold by</p>
              <p className="font-bold text-foreground">{productData.store.name}</p>
              <p className="text-xs text-muted-foreground">{productData.store.distance} away</p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">Delivery Note</p>
              <p className="font-semibold text-foreground text-sm">{productData.deliveryNotes}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-2xl p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Fresh Daily</p>
              <p className="font-bold text-foreground text-sm">Restocked</p>
            </div>
            <div className="bg-muted/50 rounded-2xl p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Quality</p>
              <p className="font-bold text-foreground text-sm">Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 ${
            isAdded
              ? "bg-primary/20 text-primary"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{isAdded ? "Added to Cart!" : "Add to Cart"}</span>
          {!isAdded && <span className="font-extrabold">· ₱{totalPrice}</span>}
        </button>
      </div>
    </main>
  )
}
