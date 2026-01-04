"use client"

import { AYTSLogo } from "@/components/ayts-logo"
import {
  GroceryIcon,
  PharmacyIcon,
  VeggiesIcon,
  ConstructionIcon,
  WaterIcon,
  LocalBusinessIcon,
} from "@/components/store-illustrations"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

// Icon mapping for categories
const iconMap: Record<string, any> = {
  "grocery": GroceryIcon,
  "pharmacy": PharmacyIcon,
  "vegetables": VeggiesIcon,
  "water-refillers": WaterIcon,
  "construction": ConstructionIcon,
  "local": LocalBusinessIcon,
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedLocation, setSelectedCategory } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!selectedLocation) {
      router.push("/")
    }
  }, [selectedLocation, router])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await api.getCategories()
        if (response.success && response.data) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Fallback to mock data
        setCategories([
          { id: "1", name: "Grocery", slug: "grocery" },
          { id: "2", name: "Pharmacy", slug: "pharmacy" },
          { id: "3", name: "Vegetables", slug: "vegetables" },
          { id: "4", name: "Water Refillers", slug: "water-refillers" },
          { id: "5", name: "Construction Supplies", slug: "construction" },
          { id: "6", name: "Local Businesses", slug: "local" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName)
    router.push("/stores")
  }

  if (!selectedLocation) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <AYTSLogo className="w-8 h-8" />
            <span className="text-lg font-bold text-primary">AYTS</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-extrabold text-foreground mb-2">Store Categories</h1>
        <p className="text-muted-foreground mb-6">in {selectedLocation.name}</p>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category: any) => {
              const IconComponent = iconMap[category.slug] || GroceryIcon
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex flex-col items-center justify-center p-6 bg-muted rounded-2xl hover:bg-accent transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                    <IconComponent className="w-10 h-10" />
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center leading-tight">{category.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 mt-auto">
        <p className="text-center text-sm text-muted-foreground font-medium">Powered by your local community</p>
      </footer>
    </main>
  )
}
