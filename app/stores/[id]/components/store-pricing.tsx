interface StorePricingProps {
  store: any
  isVerified: boolean
}

export function StorePricing({ store, isVerified }: StorePricingProps) {
  const minOrder = store.minimum_order_amount || store.minimumOrderAmount || 500
  const deliveryFee = store.delivery_fee || store.deliveryFee || 50
  
  return (
    <div className="flex items-center justify-between pt-3 border-t">
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Min. Order: </span>
          <span className="font-medium">₱{minOrder.toFixed(2)}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Delivery: </span>
          <span className="font-medium">₱{deliveryFee.toFixed(2)}</span>
        </div>
      </div>
      {isVerified && (
        <div className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full">
          <span className="text-xs font-semibold">✓ Verified</span>
        </div>
      )}
    </div>
  )
}
