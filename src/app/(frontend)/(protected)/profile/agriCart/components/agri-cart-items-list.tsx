'use client'

import { useState } from 'react'
import { FarmerProduce, AgriCartItem, Media, ProduceCategory } from '@/payload-types'
import { updateAgriCartItem, removeAgriCartItem } from '../actions'
import { Trash2, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { DefaultAssets } from '@/types/globals.enum'
import Image from 'next/image'

interface AgriCartItemsListProps {
  items: (AgriCartItem & {
    produce: FarmerProduce
  })[]
}

export default function AgriCartItemsList({ items }: AgriCartItemsListProps) {
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return

    setUpdatingItems((prev) => new Set(prev).add(itemId))

    try {
      const result = await updateAgriCartItem({
        itemId,
        quantity: newQuantity,
      })

      if (result.success) {
        toast.success('Cart updated successfully')
      } else {
        toast.error(result.error || 'Failed to update cart')
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      toast.error('An error occurred while updating the cart')
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    setRemovingItems((prev) => new Set(prev).add(itemId))

    try {
      const result = await removeAgriCartItem({ itemId })

      if (result.success) {
        toast.success('Item removed from cart')
      } else {
        toast.error(result.error || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing cart item:', error)
      toast.error('An error occurred while removing the item')
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isUpdating = updatingItems.has(item.id)
        const isRemoving = removingItems.has(item.id)
        const isLoading = isUpdating || isRemoving
        const itemTotal = (item.produce.price.nominal || 0) * item.quantity

        return (
          <div
            key={item.id}
            className={`flex items-center space-x-4 p-4 border rounded-lg transition-opacity ${
              isLoading ? 'opacity-50' : ''
            }`}
          >
            {/* Product Image */}
            <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              {item.produce.mediaGalery && item.produce.mediaGalery.length > 0 ? (
                <Image
                  src={DefaultAssets.PRODUCT}
                  alt={item.produce.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-2xl">🌾</span>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{item.produce.name}</h4>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.produce.price.nominal || 0)} per{' '}
                {item.produce.price.unit || 'unit'}
              </p>
              <p className="text-sm text-muted-foreground">
                Category: {(item.produce.category as ProduceCategory).name || 'Unknown'}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                disabled={isLoading || item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-12 text-center font-medium">{item.quantity}</span>

              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                disabled={isLoading}
                className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Unit */}
            <div className="text-sm text-muted-foreground">{item.produce.stock.unit || 'unit'}</div>

            {/* Price */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{formatPrice(itemTotal)}</div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => handleRemoveItem(item.id)}
              disabled={isLoading}
              className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove item"
            >
              {isRemoving ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
