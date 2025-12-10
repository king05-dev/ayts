"use client"

import { useState, useEffect } from "react"
import { AYTSLogo } from "@/components/ayts-logo"
import { ChevronLeft, ShoppingCart, Plus, Minus, MapPin, Clock, Phone, Star, BadgeCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"

const storeData = {
  id: 1,
  name: "Fresh Mart Grocery",
  category: "Grocery",
  distance: "0.3 km",
  rating: 4.8,
  reviewCount: 124,
  verified: true,
  bannerImage: "/grocery-store-front-with-fresh-produce.jpg",
  address: "123 Main Street, Barangay San Miguel",
  hours: "7:00 AM - 9:00 PM",
  phone: "+63 912 345 6789",
  description:
    "Fresh Mart Grocery is your neighborhood grocery store offering fresh produce, quality meats, dairy products, and everyday essentials at affordable prices.",
}

const products = [
  { id: 1, name: "Fresh Bananas", price: 45, unit: "per kg", image: "/fresh-yellow-bananas.jpg" },
  { id: 2, name: "Whole Chicken", price: 185, unit: "per kg", image: "/raw-whole-chicken.jpg" },
  { id: 3, name: "Rice (Premium)", price: 55, unit: "per kg", image: "/white-rice-grains.jpg" },
  { id: 4, name: "Fresh Eggs", price: 8, unit: "per piece", image: "/fresh-brown-eggs.jpg" },
  { id: 5, name: "Cooking Oil", price: 95, unit: "1 liter", image: "/vegetable-cooking-oil-bottle.jpg" },
  { id: 6, name: "Fresh Tomatoes", price: 60, unit: "per kg", image: "/red-ripe-tomatoes.jpg" },
  { id: 7, name: "Garlic", price: 120, unit: "per kg", image: "/fresh-garlic-bulbs.jpg" },
  { id: 8, name: "Onions", price: 80, unit: "per kg", image: "/red-onions.jpg" },
]

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<"products" | "info">("products")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { selectedLocation, cartItems, addToCart, updateCartQuantity, getCartTotal, getCartItemCount } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!selectedLocation) {
      router.push("/")
    }
  }, [selectedLocation, router])

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      storeId: storeData.id,
      storeName: storeData.name,
    })
  }

  const getCartQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id && item.storeId === storeData.id)?.quantity || 0
  }

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`)
  }

  const totalItems = getCartItemCount()
  const totalPrice = getCartTotal()

  if (!selectedLocation) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Banner Image */}
      <div className="relative h-56 w-full">
        <Image
          src={storeData.bannerImage || "/placeholder.svg"}
          alt={storeData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Header Overlay */}
        <header className="absolute top-0 left-0 right-0 z-10 px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/stores"
              className="w-10 h-10 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-md"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm shadow-md">
              <AYTSLogo className="w-6 h-6" />
              <span className="text-sm font-bold text-primary">AYTS</span>
            </div>
          </div>
        </header>
      </div>

      {/* Store Info Card */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-foreground mb-1">{storeData.name}</h1>
              <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {storeData.category}
              </span>
            </div>
            {storeData.verified && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-full">
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Verified</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-foreground">{storeData.rating}</span>
              <span>({storeData.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{storeData.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
              activeTab === "products"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
              activeTab === "info" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Info
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-6">
        {activeTab === "products" && (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => {
              const quantity = getCartQuantity(product.id)
              return (
                <div
                  key={product.id}
                  className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => handleProductClick(product.id)}
                    className="aspect-square relative bg-muted w-full"
                  >
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </button>

                  {/* Product Info */}
                  <div className="p-3">
                    <button onClick={() => handleProductClick(product.id)} className="text-left w-full">
                      <h3 className="font-bold text-foreground text-sm mb-1 truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>
                    </button>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-extrabold">₱{product.price}</span>

                      {quantity === 0 ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md shadow-primary/25"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateCartQuantity(product.id, -1)}
                            className="w-7 h-7 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-foreground">{quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(product.id, 1)}
                            className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === "info" && (
          <div className="flex flex-col gap-4">
            {/* About */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <h3 className="font-bold text-foreground mb-3">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{storeData.description}</p>
            </div>

            {/* Contact Info */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <h3 className="font-bold text-foreground mb-4">Store Information</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Address</p>
                    <p className="text-sm font-medium text-foreground">{storeData.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Store Hours</p>
                    <p className="text-sm font-medium text-foreground">{storeData.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Contact</p>
                    <p className="text-sm font-medium text-foreground">{storeData.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 bg-gradient-to-t from-background via-background to-transparent">
          <Link
            href="/cart"
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span>View Cart ({totalItems} items)</span>
            </div>
            <span className="font-extrabold">₱{totalPrice}</span>
          </Link>
        </div>
      )}
    </main>
  )
}
