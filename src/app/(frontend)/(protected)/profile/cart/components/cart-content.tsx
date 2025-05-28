'use client'

import { useState, useEffect } from 'react'
import { ShopProduct, ProductVariant, Shop, CartItem } from '@/payload-types'
import CartItemsList from './cart-items-list'
import CartSummary from './cart-summary'

interface CartContentProps {
  cartItems: any[] // The raw cart items from the backend
}

// Type for grouped cart items
interface GroupedCartItems {
  [shopId: string]: {
    shop: Shop
    items: (CartItem & {
      product: ShopProduct
      variant?: ProductVariant
    })[]
    subtotal: number
  }
}

export default function CartContent({ cartItems }: CartContentProps) {
  const [groupedItems, setGroupedItems] = useState<GroupedCartItems>({})
  const [totalAmount, setTotalAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)

  // Process cart items and group by shop
  useEffect(() => {
    const processCartItems = async () => {
      setIsProcessing(true)

      try {
        // Structure to hold cart items grouped by shop
        const grouped: GroupedCartItems = {}
        let total = 0

        if (cartItems && cartItems.length > 0) {
          cartItems.forEach((item: any) => {
            // Skip if product is not available
            if (!item.product) return

            const product = item.product as ShopProduct
            const shopId = typeof product.owner === 'number' ? product.owner : product.owner?.id
            const shopObject = typeof product.owner === 'number' ? null : (product.owner as Shop)

            if (!shopObject || !shopId) return

            // Calculate item price
            const itemPrice = item.variant
              ? typeof item.variant === 'number'
                ? 0
                : item.variant.price
              : product.information?.defaultPrice || 0

            const lineTotal = itemPrice * item.quantity
            total += lineTotal

            // Add to grouped items
            if (!grouped[shopId]) {
              grouped[shopId] = {
                shop: shopObject,
                items: [],
                subtotal: 0,
              }
            }

            grouped[shopId].items.push(item)
            grouped[shopId].subtotal += lineTotal
          })
        }

        setGroupedItems(grouped)
        setTotalAmount(total)
      } catch (error) {
        console.error('Error processing cart items:', error)
      } finally {
        setIsProcessing(false)
      }
    }

    processCartItems()
  }, [cartItems])

  if (isProcessing) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded w-1/4"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
          <div className="md:col-span-1">
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (Object.keys(groupedItems).length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        {Object.entries(groupedItems).map(([shopId, shopGroup]) => (
          <CartItemsList
            key={shopId}
            shopId={Number(shopId)}
            shopName={shopGroup.shop.shopName || 'Shop'}
            items={shopGroup.items}
            subtotal={shopGroup.subtotal}
          />
        ))}
      </div>

      <div className="md:col-span-1">
        <CartSummary groupedItems={groupedItems} totalAmount={totalAmount} />
      </div>
    </div>
  )
}
