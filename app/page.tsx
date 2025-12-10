"use client"

import { AYTSLogo } from "@/components/ayts-logo"
import { LocationSelector } from "@/components/location-selector"
import { GroceryIcon, PharmacyIcon, VeggiesIcon, ConstructionIcon } from "@/components/store-illustrations"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const { selectedLocation } = useApp()
  const router = useRouter()

  const handleSelectLocation = () => {
    if (selectedLocation) {
      router.push("/categories")
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <GroceryIcon className="absolute top-16 -left-8 w-32 h-32 opacity-60 rotate-[-15deg]" />
        <PharmacyIcon className="absolute top-24 -right-4 w-28 h-28 opacity-50 rotate-[10deg]" />
        <VeggiesIcon className="absolute bottom-48 -left-6 w-36 h-36 opacity-50 rotate-[5deg]" />
        <ConstructionIcon className="absolute bottom-32 -right-8 w-32 h-32 opacity-40 rotate-[-8deg]" />

        {/* Decorative circles */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8">
        {/* Header / Logo */}
        <header className="flex items-center justify-center pt-4 pb-8">
          <div className="flex items-center gap-3">
            <AYTSLogo className="w-12 h-12" />
            <span className="text-2xl font-extrabold text-primary tracking-tight">AYTS</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Local Marketplace</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance">
            Welcome to <span className="text-primary">AYTS</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-muted-foreground max-w-xs mx-auto mb-10 leading-relaxed">
            Find local stores in your community
          </p>

          {/* Location Selector */}
          <div className="w-full flex justify-center mb-6">
            <LocationSelector />
          </div>

          <Button
            size="lg"
            onClick={handleSelectLocation}
            disabled={!selectedLocation}
            className={`w-full max-w-sm h-14 text-lg font-bold rounded-2xl transition-all duration-200 ${
              selectedLocation
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Select My Location
          </Button>

          {/* Store Types Preview */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <GroceryIcon className="w-8 h-8" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Grocery</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <PharmacyIcon className="w-8 h-8" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Pharmacy</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <VeggiesIcon className="w-8 h-8" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Veggies</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <ConstructionIcon className="w-8 h-8" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Hardware</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-sm text-muted-foreground font-medium">Powered by your local community</p>
        </footer>
      </div>
    </main>
  )
}
