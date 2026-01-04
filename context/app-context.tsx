"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Location = {
  id: string
  name: string
  area: string
}

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  unit: string
  image: string
  storeId: number
  storeName: string
}

type AppContextType = {
  selectedLocation: Location | null
  setSelectedLocation: (location: Location | null) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  updateCartQuantity: (id: number, delta: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate state from localStorage after component mounts
  useEffect(() => {
    const savedLocation = localStorage.getItem('ayts-selected-location')
    const savedCategory = localStorage.getItem('ayts-selected-category')
    const savedCart = localStorage.getItem('ayts-cart-items')

    if (savedLocation) {
      setSelectedLocation(JSON.parse(savedLocation))
    }
    if (savedCategory) {
      setSelectedCategory(JSON.parse(savedCategory))
    }
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    setIsHydrated(true)
  }, [])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.storeId === item.storeId)
      const newItems = existing
        ? prev.map((i) =>
            i.id === item.id && i.storeId === item.storeId ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...prev, { ...item, quantity: 1 }]
      
      if (isHydrated) {
        localStorage.setItem('ayts-cart-items', JSON.stringify(newItems))
      }
      return newItems
    })
  }

  const updateCartQuantity = (id: string | number, delta: number, storeId?: string) => {
    setCartItems((prev) => {
      const newItems = prev
        .map((item) => 
          item.id === id && (!storeId || item.storeId === storeId) 
            ? { ...item, quantity: item.quantity + delta } 
            : item
        )
        .filter((item) => item.quantity > 0)
      
      if (isHydrated) {
        localStorage.setItem('ayts-cart-items', JSON.stringify(newItems))
      }
      return newItems
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id)
      if (isHydrated) {
        localStorage.setItem('ayts-cart-items', JSON.stringify(newItems))
      }
      return newItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    if (isHydrated) {
      localStorage.removeItem('ayts-cart-items')
    }
  }

  const handleSetSelectedLocation = (location: Location | null) => {
    setSelectedLocation(location)
    if (isHydrated) {
      if (location) {
        localStorage.setItem('ayts-selected-location', JSON.stringify(location))
      } else {
        localStorage.removeItem('ayts-selected-location')
      }
    }
  }

  const handleSetSelectedCategory = (category: string | null) => {
    setSelectedCategory(category)
    if (isHydrated) {
      if (category) {
        localStorage.setItem('ayts-selected-category', JSON.stringify(category))
      } else {
        localStorage.removeItem('ayts-selected-category')
      }
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <AppContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation: handleSetSelectedLocation,
        selectedCategory,
        setSelectedCategory: handleSetSelectedCategory,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
