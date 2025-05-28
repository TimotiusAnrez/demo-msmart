'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ShopProduct, ProductVariant, Shop } from '@/payload-types'
import { checkout } from '../actions'
import { useRouter } from 'next/navigation'

interface GroupedCartItems {
  [shopId: string]: {
    shop: Shop
    items: {
      id: string | number
      product: ShopProduct
      variant?: ProductVariant
      quantity: number
    }[]
    subtotal: number
  }
}

interface CartSummaryProps {
  groupedItems: GroupedCartItems
  totalAmount: number
}

export default function CartSummary({ groupedItems, totalAmount }: CartSummaryProps) {
  const router = useRouter()
  const [selectedShopId, setSelectedShopId] = useState<string | null>(
    Object.keys(groupedItems).length === 1 ? Object.keys(groupedItems)[0] : null,
  )
  const [isLoading, setIsLoading] = useState(false)

  // Get shipping fee (dummy value for now)
  const shippingFee = 20.0

  // Get tax (5% for example)
  const taxRate = 0.05
  const taxAmount = totalAmount * taxRate

  // Calculate order total
  const orderTotal = totalAmount + shippingFee

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedShopId) {
      toast('Please select a shop', {
        description: 'You need to select a shop to proceed with checkout',
      })
      return
    }

    try {
      setIsLoading(true)

      const shopGroup = groupedItems[selectedShopId]

      // Format items for WhatsApp message
      const items = shopGroup.items.map((item) => {
        const variantName =
          item.variant && typeof item.variant !== 'number' ? ` (${item.variant.name})` : ''

        return {
          name: `${item.product.information.name}${variantName}`,
          price:
            item.variant && typeof item.variant !== 'number'
              ? item.variant.price
              : item.product.information.defaultPrice,
          quantity: item.quantity,
        }
      })

      const result = await checkout({
        shopId: Number(selectedShopId),
        items,
      })

      if (result.success) {
        // Redirect to WhatsApp
        window.open(result.whatsappUrl, '_blank')
      } else {
        toast(result.error || 'Failed to create checkout')
      }
    } catch (error) {
      toast('An error occurred during checkout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Select shop for checkout */}
        {Object.keys(groupedItems).length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select shop to checkout from:</label>
            <div className="space-y-2">
              {Object.entries(groupedItems).map(([shopId, shopGroup]) => (
                <div
                  key={shopId}
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedShopId === shopId ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedShopId(shopId)}
                >
                  <div className="flex justify-between items-center">
                    <span>{shopGroup.shop.shopName}</span>
                    <span className="font-medium">{formatPrice(shopGroup.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order details */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery today with</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>

          <div className="flex items-center text-sm">
            <span className="text-muted-foreground">Skinny Express</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-medium text-lg">
          <span>Order Total</span>
          <span>{formatPrice(orderTotal)}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={isLoading || !selectedShopId}
        >
          {isLoading ? 'Processing...' : 'Checkout'}
        </Button>
      </CardFooter>
    </Card>
  )
}
