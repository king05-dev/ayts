"use client"

import { useState, useEffect, use, useRef } from "react"
import { useRouter } from "next/navigation"
import { AYTSLogo } from "@/components/ayts-logo"
import { ChevronLeft, ShoppingCart, Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api, Store, Product, CartItem } from "@/lib/api"
import { useApp } from "@/context/app-context"
import { motion, AnimatePresence } from "framer-motion"
import {
  ProductsTab,
  StoreInfoTab,
  StoreCard
} from "./components"

export default function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const storeId = resolvedParams.id
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<"products" | "info">("products")
  const { selectedLocation, cartItems, addToCart: contextAddToCart, updateCartQuantity, getCartTotal, getCartItemCount } = useApp()
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Remove location check to prevent redirect
  // useEffect(() => {
  //   if (!selectedLocation) {
  //     router.push("/")
  //   }
  // }, [selectedLocation, router])

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

  const fetchProducts = async (searchQuery?: string) => {
    try {
      const params: any = {
        storeId,
        limit: 50,
      }
      
      // Add search parameter if provided
      if (searchQuery) {
        params.search = searchQuery
      }
      
      const response = await api.getProducts(params)
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
      id: product.id, // Keep as string to preserve UUID
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.svg',
      storeId: storeId,
      storeName: store?.name || 'Store'
    })
  }

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find((item) => 
      item.id === productId && item.storeId === storeId
    )
    console.log(`Getting quantity for product ${productId} in store ${storeId}:`, item?.quantity || 0)
    return item?.quantity || 0
  }

  const handleUpdateQuantity = (productId: string, change: number) => {
    const currentQuantity = getCartQuantity(productId)
    const newQuantity = currentQuantity + change
    
    if (newQuantity <= 0) {
      // Remove item from cart if quantity becomes 0 or less
      const product = products.find(p => p.id === productId)
      if (product) {
        updateCartQuantity(productId, -currentQuantity, storeId)
      }
    } else {
      updateCartQuantity(productId, change, storeId)
    }
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

  // Search functions
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    
    // Make API call to search products
    await fetchProducts(query)
    setIsSearching(false)
  }

  const debouncedSearch = (query: string) => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query)
    }, 1000) // 300ms delay
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query) // Update input immediately for responsive UI
    
    if (query.trim() === '') {
      clearSearch()
    } else {
      debouncedSearch(query)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    // Fetch all products when clearing search
    fetchProducts()
  }

  const openSearch = () => {
    setIsSearchExpanded(true)
    setIsSearchDrawerOpen(true)
  }

  const closeSearch = () => {
    setIsSearchExpanded(false)
    setIsSearchDrawerOpen(false)
    clearSearch()
  }

  // Remove location check to allow direct access
  // if (!selectedLocation) {
  //   return null
  // }

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
      <StoreCard store={store} />

      {/* Tabs - Expandable Search Area */}
      <div className="px-4 mt-6 flex flex-row gap-4 ">
        <AnimatePresence mode="wait">
          {!isSearchExpanded ? (
            // Normal Tabs View
            <motion.div
              key="tabs"
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-row bg-muted rounded-xl p-1 relative w-full gap-4"
            >
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
            </motion.div>
          ) : (
            // Expanded Search View
            <motion.div
              key="search"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden w-full"
            >
              {/* Search Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-foreground">Search Products</h2>
                <button
                  onClick={closeSearch}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
              
              {/* Search Input */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 bg-muted rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                </div>
              </div>
              
              {/* Recent Searches */}
              <div className="px-4 pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent searches</h3>
                <div className="flex flex-wrap gap-2">
                  <span 
                    onClick={() => handleSearch("Rice")}
                    className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    Rice
                  </span>
                  <span 
                    onClick={() => handleSearch("Cooking oil")}
                    className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    Cooking oil
                  </span>
                  <span 
                    onClick={() => handleSearch("Soap")}
                    className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    Soap
                  </span>
                  <span 
                    onClick={() => handleSearch("Bread")}
                    className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    Bread
                  </span>
                </div>
              </div>
              
              {/* Popular Categories */}
              <div className="px-4 pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Popular categories</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div 
                    onClick={() => handleSearch("Vegetables")}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <span className="text-xl">🥬</span>
                    </div>
                    <span className="text-xs text-foreground">Vegetables</span>
                  </div>
                  <div 
                    onClick={() => handleSearch("Fruits")}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <span className="text-xl">🍎</span>
                    </div>
                    <span className="text-xs text-foreground">Fruits</span>
                  </div>
                  <div 
                    onClick={() => handleSearch("Bakery")}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <span className="text-xl">🥖</span>
                    </div>
                    <span className="text-xs text-foreground">Bakery</span>
                  </div>
                  <div 
                    onClick={() => handleSearch("Drinks")}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <span className="text-xl">🥤</span>
                    </div>
                    <span className="text-xs text-foreground">Drinks</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Search Button - Only show when not expanded */}
        {!isSearchExpanded && (
          <button
            onClick={openSearch}
            className="w-[25%] bg-primary flex items-center justify-center rounded-lg bg-card text-primary shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Search className="text-white w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-6">
        {activeTab === "products" && (
          <ProductsTab
            products={products}
            getCartQuantity={getCartQuantity}
            handleAddToCart={handleAddToCart}
            handleUpdateQuantity={handleUpdateQuantity}
            searchQuery={searchQuery}
            isSearching={isSearching}
          />
        )}

        {activeTab === "info" && (
          <StoreInfoTab
            store={store}
            formatOperatingHours={formatOperatingHours}
          />
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
