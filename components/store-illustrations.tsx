export function GroceryIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="8" y="20" width="48" height="36" rx="4" fill="#1D6E3E" fillOpacity="0.1" />
      <rect x="12" y="12" width="40" height="12" rx="2" fill="#1D6E3E" fillOpacity="0.15" />
      <rect x="16" y="28" width="12" height="16" rx="2" fill="#1D6E3E" fillOpacity="0.2" />
      <rect x="32" y="28" width="12" height="16" rx="2" fill="#1D6E3E" fillOpacity="0.2" />
      <circle cx="22" cy="52" r="3" fill="#1D6E3E" fillOpacity="0.3" />
      <circle cx="38" cy="52" r="3" fill="#1D6E3E" fillOpacity="0.3" />
    </svg>
  )
}

export function PharmacyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="12" y="16" width="40" height="40" rx="4" fill="#1D6E3E" fillOpacity="0.1" />
      <rect x="26" y="24" width="12" height="24" rx="2" fill="#1D6E3E" fillOpacity="0.2" />
      <rect x="20" y="30" width="24" height="12" rx="2" fill="#1D6E3E" fillOpacity="0.2" />
      <path d="M32 8V16" stroke="#1D6E3E" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function VeggiesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <ellipse cx="24" cy="40" rx="12" ry="16" fill="#1D6E3E" fillOpacity="0.15" />
      <ellipse cx="40" cy="42" rx="10" ry="14" fill="#1D6E3E" fillOpacity="0.1" />
      <path d="M24 24C24 24 20 16 24 12C28 16 24 24 24 24Z" fill="#1D6E3E" fillOpacity="0.2" />
      <path d="M40 28C40 28 36 20 40 16C44 20 40 28 40 28Z" fill="#1D6E3E" fillOpacity="0.15" />
      <circle cx="18" cy="48" r="4" fill="#1D6E3E" fillOpacity="0.2" />
      <circle cx="44" cy="50" r="3" fill="#1D6E3E" fillOpacity="0.15" />
    </svg>
  )
}

export function ConstructionIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="8" y="32" width="48" height="24" rx="2" fill="#1D6E3E" fillOpacity="0.1" />
      <rect x="16" y="24" width="32" height="8" rx="1" fill="#1D6E3E" fillOpacity="0.15" />
      <rect x="24" y="16" width="16" height="8" rx="1" fill="#1D6E3E" fillOpacity="0.2" />
      <rect x="12" y="40" width="8" height="12" fill="#1D6E3E" fillOpacity="0.15" />
      <rect x="44" y="40" width="8" height="12" fill="#1D6E3E" fillOpacity="0.15" />
      <circle cx="32" cy="12" r="4" fill="#1D6E3E" fillOpacity="0.25" />
    </svg>
  )
}

export function WaterIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      {/* Water bottle */}
      <rect x="20" y="16" width="24" height="40" rx="4" fill="#1D6E3E" fillOpacity="0.1" />
      <rect x="24" y="8" width="16" height="8" rx="2" fill="#1D6E3E" fillOpacity="0.2" />
      {/* Water level */}
      <rect x="22" y="32" width="20" height="22" rx="3" fill="#1D6E3E" fillOpacity="0.15" />
      {/* Water drops */}
      <circle cx="28" cy="40" r="2" fill="#1D6E3E" fillOpacity="0.25" />
      <circle cx="36" cy="44" r="2" fill="#1D6E3E" fillOpacity="0.2" />
      <circle cx="32" cy="48" r="1.5" fill="#1D6E3E" fillOpacity="0.25" />
    </svg>
  )
}

export function LocalBusinessIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      {/* Store building */}
      <rect x="8" y="24" width="48" height="32" rx="2" fill="#1D6E3E" fillOpacity="0.1" />
      {/* Roof/Awning */}
      <path d="M4 24L32 8L60 24H4Z" fill="#1D6E3E" fillOpacity="0.15" />
      {/* Door */}
      <rect x="26" y="36" width="12" height="20" rx="1" fill="#1D6E3E" fillOpacity="0.2" />
      {/* Windows */}
      <rect x="12" y="32" width="10" height="10" rx="1" fill="#1D6E3E" fillOpacity="0.15" />
      <rect x="42" y="32" width="10" height="10" rx="1" fill="#1D6E3E" fillOpacity="0.15" />
      {/* Door handle */}
      <circle cx="35" cy="46" r="1.5" fill="#1D6E3E" fillOpacity="0.3" />
    </svg>
  )
}
