export function AYTSLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Map Pin */}
      <path
        d="M24 4C16.268 4 10 10.268 10 18C10 28 24 44 24 44C24 44 38 28 38 18C38 10.268 31.732 4 24 4Z"
        fill="#1D6E3E"
      />
      {/* Shopping Bag */}
      <rect x="16" y="14" width="16" height="14" rx="2" fill="white" />
      <path
        d="M19 17V14C19 11.2386 21.2386 9 24 9C26.7614 9 29 11.2386 29 14V17"
        stroke="#1D6E3E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Bag details */}
      <circle cx="21" cy="21" r="1.5" fill="#1D6E3E" />
      <circle cx="27" cy="21" r="1.5" fill="#1D6E3E" />
    </svg>
  )
}
