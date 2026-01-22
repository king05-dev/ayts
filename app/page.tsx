"use client";

import { AYTSLogo } from "@/components/ayts-logo";
import { LocationSelector } from "@/components/location-selector";
import {
  GroceryIcon,
  PharmacyIcon,
  VeggiesIcon,
  ConstructionIcon,
} from "@/components/store-illustrations";
import { Button } from "@/components/ui/button";
import { MapPin, Bookmark, Star, Search, X } from "lucide-react";
import { useApp } from "@/context/app-context";
import { useRouter } from "next/navigation";
import {
  motion,
  LayoutGroup,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Location } from "@/context/app-context";
import api from "@/lib/api";

export default function LandingPage() {
  const { selectedLocation, setSelectedLocation } = useApp();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isCompact, setIsCompact] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  // Fetch locations using React Query
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      try {
        const response = await api.getLocations();
        if (response.success && response.data) {
          // Transform API data to match frontend Location type
          return response.data.map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            area: `${loc.city}, ${loc.province}`,
          }));
        }
        throw new Error("Failed to fetch locations");
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        // Fallback to mock data with real UUIDs in development
        return [
          {
            id: "ca30882d-5b10-4a05-9745-90d3c07d87f5",
            name: "Manila",
            area: "Metro Manila",
          },
          {
            id: "45beb611-02f3-48a8-bf32-f43c499f2681",
            name: "Quezon City",
            area: "Metro Manila",
          },
          {
            id: "df8faa9c-865d-4740-8327-8e526ad0a361",
            name: "Makati",
            area: "Metro Manila",
          },
          {
            id: "88dcb0e3-4ebe-4188-b8ff-93e116f2a5cb",
            name: "Pasig",
            area: "Metro Manila",
          },
        ];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSelectLocation = () => {
    if (selectedLocation) {
      router.push("/categories");
    }
  };

  const filteredLocations = locations.filter(
    (loc: Location) =>
      loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(locationSearchQuery.toLowerCase()),
  );

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setIsLocationModalOpen(false);
    setLocationSearchQuery("");
  };

  const storeCategories = useMemo(
    () => [
      {
        id: "grocery",
        title: "Grocery Stores",
        stores: [
          {
            id: "g-1",
            name: "Fresh Greens Market",
            distance: "Detancy 4.23",
            rating: 4.8,
            image:
              "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=60",
          },
          {
            id: "g-2",
            name: "Bining Ghopq",
            distance: "Detancy 4.28",
            rating: 4.6,
            image:
              "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=60",
          },
          {
            id: "g-3",
            name: "Fresh Greens Market",
            distance: "Detancy 4.80",
            rating: 4.7,
            image:
              "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?auto=format&fit=crop&w=800&q=60",
          },
          {
            id: "g-4",
            name: "Seta Grocers",
            distance: "Detancy 4.12",
            rating: 4.5,
            image:
              "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=60",
          },
        ],
      },
      {
        id: "pharmacy",
        title: "Pharmacy",
        stores: [
          {
            id: "p-1",
            name: "Winte Teark La Ploss",
            distance: "Setancsy 4.98",
            rating: 4.9,
            image:
              "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=60",
          },
          {
            id: "p-2",
            name: "Shaary Snop",
            distance: "Setancsy 8.28",
            rating: 4.4,
            image:
              "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=60",
          },
          {
            id: "p-3",
            name: "Hinte Uretwars",
            distance: "Detancy 4.75",
            rating: 4.6,
            image:
              "https://images.unsplash.com/photo-1627904455391-0dbe909ba008?auto=format&fit=crop&w=800&q=60",
          },
          {
            id: "p-4",
            name: "Fresh Grans Market",
            distance: "Detancy 4.75",
            rating: 4.3,
            image:
              "https://images.unsplash.com/photo-1584305574647-2a7d11e5c0c4?auto=format&fit=crop&w=800&q=60",
          },
        ],
      },
      {
        id: "hardware",
        title: "Hardware",
        stores: [
          {
            id: "h-1",
            name: "Strong Fixes",
            distance: "Detancy 3.60",
            rating: 4.7,
            image:
              "https://images.unsplash.com/photo-1581578017425-13b6b90c8b3f?auto=format&fit=crop&w=800&q=60",
          },
          {
            id: "h-2",
            name: "ReeekLcres",
            distance: "Detancy 3.92",
            rating: 4.5,
            image:
              "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&w=800&q=60",
          },
          {
            id: "h-3",
            name: "Rexpore",
            distance: "Detancy 4.05",
            rating: 4.6,
            image:
              "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=800&q=60",
          },
        ],
      },
    ],
    [],
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isCompact && latest > 40) setIsCompact(true);
    if (isCompact && latest < 20) setIsCompact(false);
  });

  return (
    <>
      {/* Compact Header - separate section */}
      <motion.section
        layout
        className={`fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur px-6 pt-4 pb-3 ${
          isCompact ? "block" : "hidden"
        }`}
        transition={{
          layout: { type: "spring", stiffness: 520, damping: 45 },
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <motion.div
            className="bg-background/90 backdrop-blur-sm border border-border shadow-lg shadow-foreground/5 rounded-2xl p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: isCompact ? 1 : 0,
              y: isCompact ? 0 : -20,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Mobile Compact Layout */}
            <div className="sm:hidden flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <header className="flex items-center gap-3">
                  <AYTSLogo className="w-10 h-10" />
                  <span className="text-xl font-extrabold text-primary tracking-tight">
                    AYTS
                  </span>
                </header>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GroceryIcon className="w-5 h-5" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <PharmacyIcon className="w-5 h-5" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <VeggiesIcon className="w-5 h-5" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ConstructionIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Local Marketplace
                </span>
              </div>

              <div>
                <LocationSelector onOpen={() => setIsLocationModalOpen(true)} />
              </div>
            </div>

            {/* Desktop Compact Layout */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-[1.1fr_1fr_auto] items-center gap-4">
              <div className="text-left">
                <header className="flex items-center gap-3">
                  <AYTSLogo className="w-10 h-10" />
                  <span className="text-xl font-extrabold text-primary tracking-tight">
                    AYTS
                  </span>
                </header>

                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    Local Marketplace
                  </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground leading-tight text-balance">
                  Welcome to <span className="text-primary">AYTS</span>
                </h1>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Find local stores in your community
                </p>
              </div>

              <div className="w-full">
                <LocationSelector onOpen={() => setIsLocationModalOpen(true)} />
              </div>

              <div className="flex items-center justify-start sm:justify-end gap-3 overflow-x-auto">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-1.5">
                    <GroceryIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Grocery
                  </span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-1.5">
                    <PharmacyIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Pharmacy
                  </span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-1.5">
                    <VeggiesIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Veggies
                  </span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-1.5">
                    <ConstructionIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Hardware
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Expanded Header - separate section */}
      <motion.section
        layout
        className={`${isCompact ? "hidden" : "block"}`}
        transition={{
          layout: { type: "spring", stiffness: 520, damping: 45 },
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <motion.div
            className="bg-background/90 backdrop-blur-sm shadow-foreground/5 rounded-3xl min-h-[100vh] p-7"
            animate={{
              opacity: isCompact ? 0 : 1,
              y: isCompact ? -20 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              display: isCompact ? "none" : "block",
            }}
          >
            {/* Mobile Layout */}
            <div className="sm:hidden flex flex-col items-center text-center gap-6">
              <header className="flex items-center gap-3 justify-center">
                <AYTSLogo className="w-12 h-12" />
                <span className="text-2xl font-extrabold text-primary tracking-tight">
                  AYTS
                </span>
              </header>

              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Local Marketplace
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold text-foreground leading-tight text-balance">
                Welcome to <span className="text-primary">AYTS</span>
              </h1>

              <p className="mt-4 text-lg text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Find local stores in your community
              </p>

              <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-center">
                  <LocationSelector
                    onOpen={() => setIsLocationModalOpen(true)}
                  />
                </div>

                <Button
                  size="lg"
                  onClick={handleSelectLocation}
                  disabled={!selectedLocation}
                  className={`mt-3 max-w-sm w-full h-14 text-lg font-bold rounded-2xl transition-all duration-200 ${
                    selectedLocation
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Select My Location
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <GroceryIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Grocery
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <PharmacyIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Pharmacy
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <VeggiesIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Veggies
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <ConstructionIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Hardware
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex flex-col items-center text-center gap-6">
              <header className="flex items-center gap-3 justify-center">
                <AYTSLogo className="w-12 h-12" />
                <span className="text-2xl font-extrabold text-primary tracking-tight">
                  AYTS
                </span>
              </header>

              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Local Marketplace
                </span>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight text-balance">
                Welcome to <span className="text-primary">AYTS</span>
              </h1>

              <p className="mt-4 text-lg text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Find local stores in your community
              </p>

              <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-center">
                  <LocationSelector
                    onOpen={() => setIsLocationModalOpen(true)}
                  />
                </div>

                <Button
                  size="lg"
                  onClick={handleSelectLocation}
                  disabled={!selectedLocation}
                  className={`mt-3 max-w-sm w-full h-14 text-lg font-bold rounded-2xl transition-all duration-200 ${
                    selectedLocation
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Select My Location
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <GroceryIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Grocery
                  </span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <PharmacyIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Pharmacy
                  </span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <VeggiesIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Veggies
                  </span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <ConstructionIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Hardware
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Compact Header - only visible when compact */}
        </div>
      </motion.section>

      <main
        className={`min-h-screen bg-background relative overflow-hidden ${isCompact ? "pt-40" : ""}`}
      >
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
        <div className="relative z-10 px-6 pb-16 pt-45 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-full">
          <section className="mt-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Browse Stores by Category
            </h2>

            <div className="mt-8 space-y-10">
              {storeCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-xl font-extrabold text-foreground">
                    {category.title}
                  </h3>

                  <div className="mt-4 -mx-6 px-6 overflow-x-auto">
                    <div className="flex gap-4 min-w-max pb-2">
                      {category.stores.map((store) => (
                        <div
                          key={store.id}
                          className="w-56 rounded-2xl bg-background border border-border shadow-md shadow-foreground/5 overflow-hidden"
                        >
                          <div className="relative">
                            <img
                              src={store.image}
                              alt={store.name}
                              className="h-32 w-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 w-9 h-9 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center">
                              <AYTSLogo className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-foreground leading-snug">
                                  {store.name}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground font-medium">
                                  {store.distance}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Bookmark className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                              <Star className="w-4 h-4 text-primary" />
                              <span className="text-foreground">
                                {store.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  {filteredLocations.map((location) => (
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
          {/* modal  */}
          <footer className="text-center pt-14">
            <p className="text-sm text-muted-foreground font-medium">
              Powered by your local community
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
