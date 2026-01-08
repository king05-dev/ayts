"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { AYTSLogo } from "@/components/ayts-logo"
import { ChevronLeft, ShoppingCart, Plus, Minus, MapPin, Clock, Phone, Star, BadgeCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/context/app-context"
import { useRouter, useParams } from "next/navigation"
import { api, Store, Product } from "@/lib/api"

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<"products" | "info">("products")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { selectedLocation, cartItems, addToCart, updateCartQuantity, getCartTotal, getCartItemCount } = useApp()
  const router = useRouter()
  const params = useParams()

  // Fetch store data using React Query
  const { data: store, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ["store", params.id],
    queryFn: () => api.getStore(params.id as string),
    enabled: !!params.id,
  })

  // Fetch products for this store using React Query
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["store-products", params.id],
    queryFn: () => api.getProducts({ storeId: params.id as string }),
    enabled: !!params.id,
  })

  useEffect(() => {
    if (!selectedLocation) {
      router.push("/")
    }
  }, [selectedLocation, router])

  const handleAddToCart = (product: Product) => {
    if (!store?.data) return
    
    addToCart({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      unit: product.category || "per unit",
      image: product.images?.[0] || "/placeholder.svg",
      storeId: parseInt(store.data.id),
      storeName: store.data.name,
    })
  }

  const getCartQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id && item.storeId === parseInt(store?.data?.id || "0"))?.quantity || 0
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  // Loading and error states
  if (storeLoading || productsLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading store...</p>
        </div>
      </main>
    )
  }

  if (storeError || productsError || !store?.data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Store Not Found</h1>
          <p className="text-muted-foreground mb-4">The store you're looking for doesn't exist.</p>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    )
  }

  const totalItems = getCartItemCount()
  const totalPrice = getCartTotal()

  if (!selectedLocation) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Banner Image */}
      <div className="relative h-48 bg-muted">
        <Image
          src={store.data.bannerUrl || "/placeholder.svg"}
          alt={store.data.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <AYTSLogo className="w-7 h-7" />
              <span className="text-sm font-bold text-primary">AYTS</span>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Store Info Card */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-foreground mb-1">{store.data.name}</h1>
              <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {store.data.category?.name || "Store"}
              </span>
            </div>
            {store.data.isVerified && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-full">
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Verified</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-foreground">{store.data.rating || "4.5"}</span>
              <span>({store.data.totalReviews || 0} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Local Store</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {store.data.description || "Your local community store offering quality products and great service."}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{store.data.address}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Open 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{store.data.phone || "Contact available"}</span>
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
            {productsData?.data?.products?.map((product) => {
              const quantity = getCartQuantity(parseInt(product.id))
              return (
                <div
                  key={product.id}
                  className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => handleProductClick(product.id)}
                    className="aspect-square relative bg-muted w-full"
                  >
                    <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </button>

                  {/* Product Info */}
                  <div className="p-3">
                    <button onClick={() => handleProductClick(product.id)} className="text-left w-full">
                      <h3 className="font-bold text-foreground text-sm mb-1 truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{product.category || "per unit"}</p>
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
                            onClick={() => updateCartQuantity(parseInt(product.id), -1)}
                            className="w-7 h-7 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-foreground">{quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(parseInt(product.id), 1)}
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
