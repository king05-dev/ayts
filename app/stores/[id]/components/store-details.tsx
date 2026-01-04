import { MapPin, Clock, Phone } from "lucide-react"
import { InfoItem } from "./info-item"

interface StoreDetailsProps {
  store: any
  formatOperatingHours: (hours: any) => string
}

export function StoreDetails({ 
  store, 
  formatOperatingHours 
}: StoreDetailsProps) {
  return (
    <div className="space-y-4 pt-4 border-t">
      <InfoItem
        icon={<MapPin className="w-5 h-5 text-primary" />}
        label="Address"
        value={store.address || "Address not available"}
      />
      <InfoItem
        icon={<Clock className="w-5 h-5 text-primary" />}
        label="Store Hours"
        value={formatOperatingHours(store.operating_hours)}
      />
      <InfoItem
        icon={<Phone className="w-5 h-5 text-primary" />}
        label="Contact"
        value={store.phone || "09123456783"}
      />
    </div>
  )
}
