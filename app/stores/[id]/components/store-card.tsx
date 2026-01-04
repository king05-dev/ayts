import { Store } from "@/lib/api"
import { VerifiedBadge } from "./verified-badge"
import { StoreMeta } from "./store-meta"

interface StoreCardProps {
  store: Store
}

export function StoreCard({ store }: StoreCardProps) {
  const storeData = store as any
  const isVerified = storeData.is_verified || storeData.isVerified
  const categoryName = storeData.categories?.name || 'Store'
  const rating = store.rating || '4.5'
  const totalReviews = storeData.total_reviews || 0
  
  return (
    <div className="px-4 -mt-12 relative z-10">
      <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-foreground mb-1">{store.name}</h1>
            <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {categoryName}
            </span>
          </div>
          {isVerified && (
            <VerifiedBadge />
          )}
        </div>

        <StoreMeta rating={rating} totalReviews={totalReviews} />
      </div>
    </div>
  )
}
