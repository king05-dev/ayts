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
import { useEffect } from "react"

const categories = [
  { name: "Grocery", icon: GroceryIcon },
  { name: "Pharmacy", icon: PharmacyIcon },
  { name: "Vegetable Vendors", icon: VeggiesIcon },
  { name: "Water Refillers", icon: WaterIcon },
  { name: "Construction Supplies", icon: ConstructionIcon },
  { name: "Local Businesses", icon: LocalBusinessIcon },
]

export default function CategoriesPage() {
  const { selectedLocation, setSelectedCategory } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!selectedLocation) {
      router.push("/")
    }
  }, [selectedLocation, router])

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
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.name}
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
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 mt-auto">
        <p className="text-center text-sm text-muted-foreground font-medium">Powered by your local community</p>
      </footer>
    </main>
  )
}
