import { RatingDisplay } from "./rating-display"
import { DistanceDisplay } from "./distance-display"

interface StoreMetaProps {
  rating: string | number
  totalReviews: number
}

export function StoreMeta({ rating, totalReviews }: StoreMetaProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <RatingDisplay rating={rating} totalReviews={totalReviews} />
      <DistanceDisplay distance="0.3 km" />
    </div>
  )
}
