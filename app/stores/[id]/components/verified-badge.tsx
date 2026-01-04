import { BadgeCheck } from "lucide-react"

export function VerifiedBadge() {
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-full">
      <BadgeCheck className="w-4 h-4 text-primary" />
      <span className="text-xs font-semibold text-primary">Verified</span>
    </div>
  )
}
