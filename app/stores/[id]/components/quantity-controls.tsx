import { Plus, Minus } from "lucide-react"

interface QuantityControlsProps {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
}

export function QuantityControls({ 
  quantity, 
  onDecrease, 
  onIncrease 
}: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className="w-7 h-7 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-sm font-bold text-foreground min-w-[1.5rem] text-center">{quantity}</span>
      <button
        onClick={onIncrease}
        className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  )
}
