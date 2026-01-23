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
import { ChevronLeft, MapPin, X } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/context/app-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

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
  const [loading, setLoading] = useState(true)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [locationSearchQuery, setLocationSearchQuery] = useState("")
  const { selectedLocation, setSelectedLocation, setSelectedCategory } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch categories using React Query
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await api.getCategories()
        if (response.success && response.data) {
          return response.data
        }
        // Fallback to mock data
        return [
          { id: "1", name: "Grocery", slug: "grocery" },
          { id: "2", name: "Pharmacy", slug: "pharmacy" },
          { id: "3", name: "Vegetables", slug: "vegetables" },
          { id: "4", name: "Water Refillers", slug: "water-refillers" },
          { id: "5", name: "Construction Supplies", slug: "construction" },
          { id: "6", name: "Local Businesses", slug: "local" }
        ]
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  // Fetch locations using React Query for URL parameter handling
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      try {
        const response = await api.getLocations()
        if (response.success && response.data) {
          return response.data
        }
        return []
      } catch (error) {
        console.error('Failed to fetch locations:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Handle location from URL parameters
  useEffect(() => {
    const locationId = searchParams.get('location')
    if (locationId && !selectedLocation && locations.length > 0) {
      const location = locations.find((loc: any) => loc.id === locationId)
      if (location) {
        setSelectedLocation({
          id: location.id,
          name: location.name,
          area: `${location.city}, ${location.province}`,
        })
      }
    }
    
    if (!selectedLocation && !searchParams.get('location')) {
      router.push("/")
    }
  }, [selectedLocation, router, searchParams, setSelectedLocation, locations])

  // Update loading state
  useEffect(() => {
    setLoading(categoriesLoading)
  }, [categoriesLoading])

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName)
    router.push("/stores")
  }

  const handleLocationSelect = (location: any) => {
    setSelectedLocation({
      id: location.id,
      name: location.name,
      area: `${location.city}, ${location.province}`,
    })
    setIsLocationModalOpen(false)
    setLocationSearchQuery("")
    // Navigate to categories with new location parameter
    router.push(`/categories?location=${location.id}`)
  }

  const filteredLocations = locations.filter(
    (loc: any) =>
      loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
      `${loc.city}, ${loc.province}`.toLowerCase().includes(locationSearchQuery.toLowerCase()),
  )

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <p className="text-lg font-semibold text-foreground">
              Stores in <span className="text-primary">{selectedLocation.name}</span>
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Change Location
          </button>
        </div>

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

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsLocationModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl p-6 pb-8 sm:m-4 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                Select Location
              </h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your area..."
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl border-2 border-transparent focus:border-primary/30 focus:outline-none text-foreground placeholder:text-muted-foreground transition-colors"
              />
            </div>

            {/* Location List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredLocations.map((location: any) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedLocation?.id === location.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-accent text-foreground"
                  }`}
                >
                  <MapPin
                    className={`w-5 h-5 ${
                      selectedLocation?.id === location.id
                        ? "text-primary-foreground"
                        : "text-primary"
                    }`}
                  />
                  <div className="text-left">
                    <p className="font-semibold">{location.name}</p>
                    <p
                      className={`text-xs ${
                        selectedLocation?.id === location.id
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {location.city}, {location.province}
                    </p>
                  </div>
                </button>
              ))}

              {filteredLocations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No locations found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
