'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Minus, Plus, Trash } from 'lucide-react'
import { ShopProduct, ProductVariant, CartItem, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { updateCartItem, removeCartItem } from '../actions'
import { toast } from 'sonner'
import { DefaultAssets } from '@/types/globals.enum'

interface CartItemsListProps {
  shopId: number
  shopName: string
  items: (CartItem & {
    product: ShopProduct
    variant?: ProductVariant
  })[]
  subtotal: number
}

export default function CartItemsList({ shopId, shopName, items, subtotal }: CartItemsListProps) {
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})

  // Handle quantity updates
  const handleUpdateQuantity = async (itemId: string | number, quantity: number) => {
    if (quantity < 1) return

    try {
      setIsUpdating((prev) => ({ ...prev, [itemId]: true }))

      const result = await updateCartItem({
        itemId: Number(itemId),
        quantity,
      })

      if (result.success) {
        toast.success('Cart updated', {
          description: 'Your cart has been updated successfully',
        })
      } else {
        toast.error('Update failed', {
          description: result.error || 'Failed to update cart',
        })
      }
    } catch (error) {
      toast.error('Error', {
        description: 'An error occurred while updating your cart',
      })
    } finally {
      setIsUpdating((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  // Handle item removal
  const handleRemoveItem = async (itemId: string | number) => {
    try {
      setIsUpdating((prev) => ({ ...prev, [itemId]: true }))

      const result = await removeCartItem({
        itemId: Number(itemId),
      })

      if (result.success) {
        toast.success('Item removed', {
          description: 'Item has been removed from your cart',
        })
      } else {
        toast.error('Removal failed')
      }
    } catch (error) {
      toast.error('Error', {
        description: 'An error occurred while removing the item',
      })
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>{shopName}</span>
          <Link href={`/shopping?shop=${shopId}`}>
            <Button variant="outline" size="sm">
              Shop More
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {items.map((item) => {
          // Get product and variant information
          const product = item.product
          const variant =
            item.variant && typeof item.variant !== 'number' ? item.variant : undefined

          // Get media
          const getMedia =
            item.product.information.mediaGallery &&
            item.product.information.mediaGallery.length > 0 &&
            item.product.information.mediaGallery[0].media
              ? item.product.information.mediaGallery[0].media
              : null
          const media = getMedia as Media
          const mediaUrl = media?.sizes?.thumbnail?.url || DefaultAssets.PRODUCT

          // Calculate price
          const price = variant ? variant.price : product.information.defaultPrice
          const lineTotal = price * item.quantity

          return (
            <div key={item.id} className="p-4 border-b last:border-b-0">
              <div className="flex gap-4">
                {/* Product image */}
                <div className="flex-shrink-0 w-20 h-20 relative rounded overflow-hidden">
                  {media && 'url' in media ? (
                    <Image
                      src={mediaUrl}
                      alt={product.information.name}
                      width={500}
                      height={500}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.information.name}</h3>
                      {variant && <p className="text-sm text-muted-foreground">{variant.name}</p>}
                      <p className="text-sm text-muted-foreground">{formatPrice(price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(lineTotal)}</p>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isUpdating[item.id] || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <div className="h-8 px-3 flex items-center justify-center border border-input bg-background">
                        {item.quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdating[item.id]}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating[item.id]}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <span className="font-medium">Subtotal</span>
        <span className="font-medium">{formatPrice(subtotal)}</span>
      </CardFooter>
    </Card>
  )
}
