"use client"

import { MapPin, ChevronDown, Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useApp, type Location } from "@/context/app-context"
import { api } from "@/lib/api"

export function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const { selectedLocation, setSelectedLocation } = useApp()

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        const response = await api.getLocations()
        if (response.success && response.data) {
          // Transform API data to match frontend Location type
          const transformedLocations = response.data.map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            area: `${loc.city}, ${loc.province}`
          }))
          setLocations(transformedLocations)
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error)
        // Fallback to mock data if API fails
        setLocations([
          { id: "1", name: "Manila", area: "Metro Manila" },
          { id: "2", name: "Quezon City", area: "Metro Manila" },
          { id: "3", name: "Makati", area: "Metro Manila" },
          { id: "4", name: "Pasig", area: "Metro Manila" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const filteredLocations = locations.filter(
    (loc: Location) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelect = (location: Location) => {
    setSelectedLocation(location)
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <div className="w-full max-w-sm">
      {/* Location Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-secondary rounded-2xl border-2 border-border hover:border-primary/30 transition-all duration-200 group"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs text-muted-foreground font-medium">Your Location</p>
          <p className="text-foreground font-semibold">
            {selectedLocation ? selectedLocation.name : "Select your area"}
          </p>
        </div>
        <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl p-6 pb-8 sm:m-4 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Select Location</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl border-2 border-transparent focus:border-primary/30 focus:outline-none text-foreground placeholder:text-muted-foreground transition-colors"
              />
            </div>

            {/* Location List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedLocation?.id === location.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-accent text-foreground"
                  }`}
                >
                  <MapPin
                    className={`w-5 h-5 ${
                      selectedLocation?.id === location.id ? "text-primary-foreground" : "text-primary"
                    }`}
                  />
                  <div className="text-left">
                    <p className="font-semibold">{location.name}</p>
                    <p
                      className={`text-xs ${
                        selectedLocation?.id === location.id ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {location.area}
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
    </div>
  )
}
