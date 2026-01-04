import { Product } from "@/lib/api"
import { ProductCard } from "./product-card"
import { Search } from "lucide-react"

interface ProductsTabProps {
  products: Product[]
  getCartQuantity: (id: string) => number
  handleAddToCart: (product: Product) => void
  handleUpdateQuantity: (id: string, change: number) => void
  searchQuery?: string
  isSearching?: boolean
}

export function ProductsTab({ 
  products, 
  getCartQuantity, 
  handleAddToCart, 
  handleUpdateQuantity,
  searchQuery,
  isSearching = false
}: ProductsTabProps) {
  return (
    <>
      {/* Search Status Bar */}
      {searchQuery && (
        <div className="mb-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <p className="text-sm text-primary font-medium">
              {isSearching ? 'Searching...' : `Found ${products.length} results for "${searchQuery}"`}
            </p>
          </div>
        </div>
      )}
      
      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const quantity = getCartQuantity(product.id)
          return (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantity}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )
        })}
      </div>
      
      {/* No Results */}
      {searchQuery && products.length === 0 && !isSearching && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-sm text-muted-foreground">Try searching for different keywords</p>
        </div>
      )}
    </>
  )
}
