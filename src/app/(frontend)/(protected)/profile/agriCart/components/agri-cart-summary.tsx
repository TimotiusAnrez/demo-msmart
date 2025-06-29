'use client'

import { useState } from 'react'
import { FarmerProduce, Farmer, AgriCartItem } from '@/payload-types'
import { checkoutAgriCart } from '../actions'
import { MessageCircle, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface AgriCartSummaryProps {
  farmerId: number
  farmer: Farmer
  items: (AgriCartItem & {
    produce: FarmerProduce
  })[]
  subtotal: number
}

export default function AgriCartSummary({
  farmerId,
  farmer,
  items,
  subtotal,
}: AgriCartSummaryProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    try {
      // Prepare checkout items
      const checkoutItems = items.map((item) => ({
        name: item.produce.name,
        price: item.produce.price.nominal || 0,
        quantity: item.quantity,
        unit: item.produce.price.unit || 'unit',
        farmer: farmer.fullName || 'Unknown Farmer',
      }))

      const result = await checkoutAgriCart({
        farmerId,
        items: checkoutItems,
      })

      if (result.success && result.whatsappUrl) {
        // Open WhatsApp URL in a new window
        window.open(result.whatsappUrl, '_blank')
        toast.success('Opening WhatsApp to complete your order')
      } else {
        toast.error(result.error || 'Failed to process checkout')
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      toast.error('An error occurred during checkout')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary Details */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({items.length})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {/* Show item breakdown */}
        <div className="space-y-1">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
              <span>
                {item.produce.name} × {item.quantity} {item.produce.price.unit || 'unit'}
              </span>
              <span>{formatPrice((item.produce.price.nominal || 0) * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-base font-semibold">
          <span>Subtotal:</span>
          <span className="text-green-600">{formatPrice(subtotal)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="pt-4">
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut || items.length === 0}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCheckingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" />
              <span>Order via WhatsApp</span>
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center mt-2">
          This will open WhatsApp to complete your order with {farmer.fullName || 'the farmer'}
        </p>
      </div>

      {/* Farmer Contact Info */}
      {farmer.contact.phone && (
        <div className="pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>Contact: {farmer.contact.phone}</span>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="pt-2">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <ShoppingCart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-green-800">
              <p className="font-medium mb-1">Fresh from the Farm</p>
              <p>
                Orders are processed directly with farmers to ensure the freshest produce. Payment
                and delivery arrangements will be discussed via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
