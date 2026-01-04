import { Store } from "@/lib/api"
import { StoreDetails } from "./store-details"
import { StorePricing } from "./store-pricing"

interface StoreInfoTabProps {
  store: Store
  formatOperatingHours: (hours: any) => string 
}

export function StoreInfoTab({ store, formatOperatingHours }: StoreInfoTabProps) {
  const storeData = store as any
  const isVerified = storeData.is_verified || storeData.isVerified
  
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">Store Information</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {store.description || "Your neighborhood store offering fresh produce and daily essentials at affordable prices."}
          </p>
        </div>
        
        <StoreDetails 
          store={storeData}
          formatOperatingHours={formatOperatingHours}
        />
        
        <StorePricing store={storeData} isVerified={isVerified} />
      </div>
    </div>
  )
}
