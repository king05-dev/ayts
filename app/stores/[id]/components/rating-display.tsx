import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: string | number
  totalReviews: number
}

export function RatingDisplay({ rating, totalReviews }: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
      <span className="font-semibold text-foreground">{rating}</span>
      <span>({totalReviews})</span>
    </div>
  )
}
