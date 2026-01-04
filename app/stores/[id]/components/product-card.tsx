import { Product } from "@/lib/api"
import Image from "next/image"
import { Plus } from "lucide-react"
import { QuantityControls } from "./quantity-controls"

interface ProductCardProps {
  product: Product
  quantity: number
  onAddToCart: (product: Product) => void
  onUpdateQuantity: (id: string, change: number) => void
}

export function ProductCard({ 
  product, 
  quantity, 
  onAddToCart, 
  onUpdateQuantity 
}: ProductCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square relative bg-muted">
        <Image 
          src={product.images?.[0] || "/placeholder.svg"} 
          alt={product.name} 
          fill 
          className="object-cover" 
        />
      </div>

      <div className="p-3">
        <h3 className="font-bold text-foreground text-sm mb-1 truncate">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-extrabold">₱{product.price}</span>

          {quantity === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <QuantityControls
              quantity={quantity}
              onDecrease={() => onUpdateQuantity(product.id, -1)}
              onIncrease={() => onUpdateQuantity(product.id, 1)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
