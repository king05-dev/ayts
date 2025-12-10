"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Location = {
  id: number
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

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.storeId === item.storeId)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.storeId === item.storeId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateCartQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
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
        setSelectedLocation,
        selectedCategory,
        setSelectedCategory,
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
