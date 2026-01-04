import { MapPin } from "lucide-react"

interface DistanceDisplayProps {
  distance: string
}

export function DistanceDisplay({ distance }: DistanceDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      <MapPin className="w-4 h-4" />
      <span>{distance}</span>
    </div>
  )
}
