"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AYTSLogo } from "@/components/ayts-logo"
import { ChevronLeft, ShoppingCart, Plus, Minus, MapPin, Clock, Phone, Star, BadgeCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api, Store, Product, CartItem } from "@/lib/api"
import { useApp } from "@/context/app-context"

export default function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const storeId = resolvedParams.id
  const [activeTab, setActiveTab] = useState<"products" | "info">("products")
  const { selectedLocation, cartItems, addToCart: contextAddToCart, updateCartQuantity, getCartTotal, getCartItemCount } = useApp()
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedLocation) {
      router.push("/")
    }
  }, [selectedLocation, router])

  const fetchStore = async () => {
    try {
      const response = await api.getStore(storeId)
      if (response.success && response.data) {
        setStore(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch store:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts({
        storeId,
        limit: 50,
      })
      if (response.success && response.data) {
        setProducts(response.data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  useEffect(() => {
    if (storeId) {
      setLoading(true)
      Promise.all([fetchStore(), fetchProducts()]).finally(() => {
        setLoading(false)
      })
    }
  }, [storeId])

  const handleAddToCart = (product: Product) => {
    contextAddToCart({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.svg',
      storeId: storeId,
      storeName: store?.name || 'Store'
    })
  }

  const getCartQuantity = (id: string) => {
    return cartItems.find((item) => item.id === parseInt(id) && item.storeId === storeId)?.quantity || 0
  }

  const formatOperatingHours = (hours: Record<string, { open: string; close: string }> | null | undefined) => {
    if (!hours) return 'Hours not available'
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const todayShort = today.slice(0, 3)
    const todayHours = hours[today] || hours[todayShort]
    
    if (!todayHours) return 'Closed Today'
    return `Open: ${todayHours.open} - ${todayHours.close}`
  }

  const totalItems = getCartItemCount()
  const totalPrice = getCartTotal()

  if (!selectedLocation) {
    return null
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <div className="animate-pulse">
          <div className="h-56 bg-gray-200"></div>
          <div className="px-4 -mt-12 relative z-10">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="px-4 mt-6">
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!store) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Store not found</h2>
          <p className="text-gray-600">The store you're looking for doesn't exist.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Banner Image */}
      <div className="relative h-56 w-full">
        <Image
          src={(store as any).banner_url || (store as any).bannerUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"}
          alt={store.name}
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
              <h1 className="text-xl font-extrabold text-foreground mb-1">{store.name}</h1>
              <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {(store as any).categories?.name || 'Store'}
              </span>
            </div>
            {((store as any).is_verified || (store as any).isVerified) && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-full">
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Verified</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-foreground">{store.rating || '4.5'}</span>
              <span>({(store as any).total_reviews || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>0.3 km</span>
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
                  <div className="aspect-square relative bg-muted">
                    <Image 
                      src={product.images?.[0] || "/placeholder.svg"} 
                      alt={product.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-foreground text-sm mb-1 truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(parseInt(product.id), -1)}
                            className="w-7 h-7 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-foreground min-w-[1.5rem] text-center">{quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(parseInt(product.id), 1)}
                            className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
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
          <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">Store Information</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {store.description || "Your neighborhood store offering fresh produce and daily essentials at affordable prices."}
                </p>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Address</p>
                    <p className="text-sm font-medium text-foreground">{(store as any)?.address || "Address not available"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Store Hours</p>
                    <p className="text-sm font-medium text-foreground">{formatOperatingHours((store as any)?.operating_hours)}</p>
                  </div>
                </div>
                {(store as any)?.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Contact</p>
                      <p className="text-sm font-medium text-foreground">{(store as any).phone}</p>
                    </div>
                  </div>
                )}
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
