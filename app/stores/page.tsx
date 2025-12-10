"use client"

import { useState, useEffect } from "react"
import { AYTSLogo } from "@/components/ayts-logo"
import { ChevronLeft, SlidersHorizontal, MapPin, X, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"

const stores = [
  {
    id: 1,
    name: "Fresh Mart Grocery",
    category: "Grocery",
    distance: "0.3 km",
    image: "/grocery-store-front-with-fresh-produce.jpg",
  },
  {
    id: 2,
    name: "HealthPlus Pharmacy",
    category: "Pharmacy",
    distance: "0.5 km",
    image: "/pharmacy-store-front-green-cross.jpg",
  },
  {
    id: 3,
    name: "Maria's Vegetable Stand",
    category: "Vegetable Vendors",
    distance: "0.7 km",
    image: "/vegetable-market-stall-colorful.jpg",
  },
  {
    id: 4,
    name: "AquaPure Refilling Station",
    category: "Water Refillers",
    distance: "0.8 km",
    image: "/water-refilling-station-blue-bottles.jpg",
  },
  {
    id: 5,
    name: "BuildRight Hardware",
    category: "Construction Supplies",
    distance: "1.2 km",
    image: "/hardware-store-construction-supplies.jpg",
  },
  {
    id: 6,
    name: "Juan's Sari-Sari Store",
    category: "Local Businesses",
    distance: "0.2 km",
    image: "/small-convenience-store-colorful.jpg",
  },
  {
    id: 7,
    name: "Green Valley Produce",
    category: "Grocery",
    distance: "1.5 km",
    image: "/organic-grocery-store-produce.jpg",
  },
  {
    id: 8,
    name: "MedCare Drugstore",
    category: "Pharmacy",
    distance: "1.8 km",
    image: "/modern-pharmacy-drugstore.jpg",
  },
]

const sortOptions = [
  { id: "distance", label: "Distance" },
  { id: "name", label: "Name (A-Z)" },
  { id: "category", label: "Category" },
]

const categoryFilters = [
  "All",
  "Grocery",
  "Pharmacy",
  "Vegetable Vendors",
  "Water Refillers",
  "Construction Supplies",
  "Local Businesses",
]

export default function StoresPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("distance")
  const { selectedLocation, selectedCategory, setSelectedCategory } = useApp()
  const router = useRouter()
  const [filterCategory, setFilterCategory] = useState(selectedCategory || "All")

  useEffect(() => {
    if (!selectedLocation) {
      router.push("/")
    }
  }, [selectedLocation, router])

  useEffect(() => {
    if (selectedCategory) {
      setFilterCategory(selectedCategory)
    }
  }, [selectedCategory])

  const filteredStores = stores
    .filter((store) => filterCategory === "All" || store.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "distance") {
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category)
      }
      return 0
    })

  const handleStoreClick = (storeId: number) => {
    router.push(`/store/${storeId}`)
  }

  const handleFilterChange = (category: string) => {
    setFilterCategory(category)
    if (category === "All") {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(category)
    }
  }

  if (!selectedLocation) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/categories"
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <AYTSLogo className="w-8 h-8" />
              <span className="text-lg font-bold text-primary">AYTS</span>
            </div>
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-foreground mb-1">
            {filterCategory === "All" ? "All Stores" : filterCategory}
          </h1>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              in {selectedLocation.name} · {filteredStores.length} stores found
            </span>
          </div>
        </div>

        {/* Active Filters */}
        {(filterCategory !== "All" || sortBy !== "distance") && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filterCategory !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {filterCategory}
                <button onClick={() => handleFilterChange("All")} className="hover:bg-primary/20 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortBy !== "distance" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full">
                Sorted by {sortOptions.find((o) => o.id === sortBy)?.label}
              </span>
            )}
          </div>
        )}

        {/* Store List */}
        <div className="flex flex-col gap-4">
          {filteredStores.map((store) => (
            <button
              key={store.id}
              onClick={() => handleStoreClick(store.id)}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
            >
              {/* Store Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={store.image || "/placeholder.svg"}
                  alt={store.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Store Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-base mb-1 truncate">{store.name}</h3>
                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">
                  {store.category}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm">{store.distance}</span>
                </div>
              </div>

              {/* Arrow indicator */}
              <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredStores.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground mb-1">No stores found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 mt-auto">
        <p className="text-center text-sm text-muted-foreground font-medium">Powered by your local community</p>
      </footer>

      {/* Sort/Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-background rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            {/* Handle */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Sort & Filter</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sort By</h3>
              <div className="flex flex-col gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      sortBy === option.id ? "bg-primary/10 text-primary" : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    {sortBy === option.id && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Category */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filterCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
