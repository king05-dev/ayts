"use client"

import { MapPin, ChevronDown, Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useApp, type Location } from "@/context/app-context"
import { api } from "@/lib/api"

export function LocationSelector({ onOpen }: { onOpen: () => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const { selectedLocation, setSelectedLocation } = useApp()

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        console.log('Fetching locations from API...')
        const response = await api.getLocations()
        console.log('Locations API response:', response)
        if (response.success && response.data) {
          // Transform API data to match frontend Location type
          const transformedLocations = response.data.map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            area: `${loc.city}, ${loc.province}`
          }))
          console.log('Transformed locations:', transformedLocations)
          setLocations(transformedLocations)
          
          // Clear any old cached location data that doesn't match the new format
          const savedLocation = localStorage.getItem('ayts-selected-location')
          if (savedLocation) {
            try {
              const parsed = JSON.parse(savedLocation)
              // If the saved location has a numeric ID, clear it
              if (/^\d+$/.test(parsed.id)) {
                console.log('Clearing old cached location with numeric ID:', parsed.id)
                localStorage.removeItem('ayts-selected-location')
                // Clear the selected location in context as well
                setSelectedLocation(null)
              }
            } catch (e) {
              console.log('Invalid cached location data, clearing it')
              localStorage.removeItem('ayts-selected-location')
            }
          }
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error)
        // Only use fallback data in development, not in production
        if (process.env.NODE_ENV === 'development') {
          console.log('Using fallback mock data')
          setLocations([
            { id: "ca30882d-5b10-4a05-9745-90d3c07d87f5", name: "Manila", area: "Metro Manila" },
            { id: "45beb611-02f3-48a8-bf32-f43c499f2681", name: "Quezon City", area: "Metro Manila" },
            { id: "df8faa9c-865d-4740-8327-8e526ad0a361", name: "Makati", area: "Metro Manila" },
            { id: "88dcb0e3-4ebe-4188-b8ff-93e116f2a5cb", name: "Pasig", area: "Metro Manila" }
          ])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [setSelectedLocation])

  const filteredLocations = locations.filter(
    (loc: Location) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelect = (location: Location) => {
    setSelectedLocation(location)
    setSearchQuery("")
  }

  return (
    <div className="w-full max-w-sm">
      {/* Location Button */}
      <button
        onClick={onOpen}
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
    </div>
  )
}
