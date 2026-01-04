"use client"

import { useState, useEffect } from "react"
import { AYTSLogo } from "@/components/ayts-logo"
import { ChevronLeft, SlidersHorizontal, MapPin, X, Check, Star, Clock, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"
import { api, Store, Category, Location } from "@/lib/api"

const sortOptions = [
  { id: "name", label: "Name (A-Z)" },
  { id: "rating", label: "Rating" },
  { id: "created_at", label: "Newest First" },
]

const categoryFilters = [
  "All",
  "Grocery",
  "Pharmacy", 
  "Vegetables",
  "Water Refillers",
  "Construction Supplies",
  "Local Businesses",
]

export default function StoresPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const [stores, setStores] = useState<Store[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const { selectedLocation, selectedCategory, setSelectedCategory } = useApp()
  const router = useRouter()
  const [filterCategory, setFilterCategory] = useState(selectedCategory || "All")

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.getStores({
        limit: pagination.limit,
        locationId: selectedLocation?.id || undefined,
      });

      if (response.success && response.data) {
        // Handle direct array response from API
        setStores(response.data);
        
        // Update pagination if available
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      // Set fallback mock data
      setStores([
        {
          id: '1',
          vendorId: 'vendor-1',
          name: 'Fresh Mart Grocery',
          description: 'Your friendly neighborhood grocery store',
          categoryId: '1',
          locationId: selectedLocation?.id || '1',
          address: '123 Main St, Manila',
          phone: '+639987654321',
          email: 'freshmart@example.com',
          rating: 4.5,
          totalReviews: 25,
          isVerified: true,
          isActive: true,
          bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
          logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
          operatingHours: {
            mon: { open: '08:00', close: '20:00' },
            tue: { open: '08:00', close: '20:00' },
            wed: { open: '08:00', close: '20:00' },
            thu: { open: '08:00', close: '20:00' },
            fri: { open: '08:00', close: '20:00' },
            sat: { open: '08:00', close: '18:00' },
            sun: { open: '09:00', close: '17:00' }
          },
          deliveryRadiusKm: 5,
          minimumOrderAmount: 100,
          deliveryFee: 50,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback categories
      setCategories([
        { id: "1", name: "Grocery", slug: "grocery", isActive: true, sortOrder: 1, createdAt: new Date().toISOString() },
        { id: "2", name: "Pharmacy", slug: "pharmacy", isActive: true, sortOrder: 2, createdAt: new Date().toISOString() },
        { id: "3", name: "Vegetables", slug: "vegetables", isActive: true, sortOrder: 3, createdAt: new Date().toISOString() },
        { id: "4", name: "Water Refillers", slug: "water-refillers", isActive: true, sortOrder: 4, createdAt: new Date().toISOString() },
        { id: "5", name: "Construction Supplies", slug: "construction", isActive: true, sortOrder: 5, createdAt: new Date().toISOString() },
        { id: "6", name: "Local Businesses", slug: "local", isActive: true, sortOrder: 6, createdAt: new Date().toISOString() }
      ]);
    }
  };

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

  useEffect(() => {
    if (selectedLocation) {
      fetchStores();
      fetchCategories();
    }
  }, [selectedLocation, pagination.page, sortBy])

  const handleFilterChange = (category: string) => {
    setFilterCategory(category)
    if (category === "All") {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(category)
    }
  }

  const filteredStores = stores
    .filter((store) => {
      if (filterCategory === "All") return true;
      // Handle both API response format (store.categories.name) and fallback format (store.categoryId)
      const categoryName = (store as any).categories?.name || 
                          categories.find(c => c.id === (store as any).categoryId)?.name;
      return categoryName === filterCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "created_at") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    })

  const handleStoreClick = (storeId: string) => {
    router.push(`/stores/${storeId}`)
  }

  const formatOperatingHours = (hours: Record<string, { open: string; close: string }> | null | undefined) => {
    if (!hours) return 'Hours not available';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    // Handle both 'fri' and 'friday' formats
    const todayShort = today.slice(0, 3);
    const todayHours = hours[today] || hours[todayShort];
    
    if (!todayHours) return 'Closed';
    return `Today: ${todayHours.open} - ${todayHours.close}`;
  };

  if (!selectedLocation) {
    return null
  }

  if (loading && stores.length === 0) {
    return (
      <main className="min-h-screen bg-background pb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 gap-4 px-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-24"></div>
            ))}
          </div>
        </div>
      </main>
    );
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
          {filteredStores.map((store) => {
            const categoryName = categories.find(c => c.id === store.categoryId)?.name || 'Unknown';
            return (
              <button
                key={store.id}
                onClick={() => handleStoreClick(store.id)}
                className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                {/* Store Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={store.bannerUrl || store.logoUrl || "/placeholder.svg"}
                    alt={store.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Store Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-foreground text-base truncate">{store.name}</h3>
                    {store.rating > 0 && (
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{store.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">
                    {categoryName}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm truncate">{store.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">{formatOperatingHours(store.operatingHours)}</span>
                    </div>
                    {store.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-xs">{store.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span>Min: ₱{((store as any).minimum_order_amount || (store as any).minimumOrderAmount || 0).toFixed(2)}</span>
                    <span>Delivery: ₱{((store as any).delivery_fee || (store as any).deliveryFee || 0).toFixed(2)}</span>
                    {((store as any).is_verified || (store as any).isVerified) && (
                      <span className="text-green-600 font-medium">✓ Verified</span>
                    )}
                  </div>
                </div>

                {/* Arrow indicator */}
                <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180 flex-shrink-0" />
              </button>
            );
          })}
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
