'use client'

import { useState, useEffect } from 'react'
import { FarmerProduce, AgriCartItem, Farmer } from '@/payload-types'
import AgriCartItemsList from './agri-cart-items-list'
import AgriCartSummary from './agri-cart-summary'

interface AgriCartContentProps {
  cartItems: any[] // The raw agri cart items from the backend
}

// Type for grouped agri cart items
interface GroupedAgriCartItems {
  [farmerId: string]: {
    farmer: Farmer
    items: (AgriCartItem & {
      produce: FarmerProduce
    })[]
    subtotal: number
  }
}

export default function AgriCartContent({ cartItems }: AgriCartContentProps) {
  const [groupedItems, setGroupedItems] = useState<GroupedAgriCartItems>({})
  const [totalAmount, setTotalAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)

  // Process cart items and group by farmer
  useEffect(() => {
    const processCartItems = async () => {
      setIsProcessing(true)

      try {
        // Structure to hold cart items grouped by farmer
        const grouped: GroupedAgriCartItems = {}
        let total = 0

        if (cartItems && cartItems.length > 0) {
          cartItems.forEach((item: any) => {
            // Skip if produce is not available
            if (!item.produce) return

            const produce = item.produce as FarmerProduce
            const farmerId =
              typeof produce.farmer === 'number' ? produce.farmer : produce.farmer?.id
            const farmerObject =
              typeof produce.farmer === 'number' ? null : (produce.farmer as Farmer)

            if (!farmerObject || !farmerId) return

            // Calculate item price
            const itemPrice = produce.price.nominal || 0
            const itemQuantity = item.quantity || 0
            const itemTotal = itemPrice * itemQuantity

            // Add to grouped items
            if (!grouped[farmerId]) {
              grouped[farmerId] = {
                farmer: farmerObject,
                items: [],
                subtotal: 0,
              }
            }

            grouped[farmerId].items.push({
              ...item,
              produce,
            })
            grouped[farmerId].subtotal += itemTotal
            total += itemTotal
          })
        }

        setGroupedItems(grouped)
        setTotalAmount(total)
      } catch (error) {
        console.error('Error processing agri cart items:', error)
      } finally {
        setIsProcessing(false)
      }
    }

    processCartItems()
  }, [cartItems])

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (Object.keys(groupedItems).length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <div className="text-6xl mb-4">🌾</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your agricultural cart is empty
        </h3>
        <p className="text-muted-foreground mb-4">
          Browse our fresh produce and add items to your cart.
        </p>
        <a
          href="/agriculture"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Browse Agricultural Products
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Cart Items by Farmer */}
      {Object.entries(groupedItems).map(([farmerId, group]) => (
        <div key={farmerId} className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b bg-green-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {group.farmer.fullName?.charAt(0).toUpperCase() || 'F'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {group.farmer.fullName || 'Unknown Farmer'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <AgriCartItemsList items={group.items} />
          </div>

          <div className="px-6 py-4 border-t bg-gray-50">
            <AgriCartSummary
              farmerId={parseInt(farmerId)}
              farmer={group.farmer}
              items={group.items}
              subtotal={group.subtotal}
            />
          </div>
        </div>
      ))}

      {/* Total Summary */}
      {Object.keys(groupedItems).length > 1 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Grand Total:</span>
            <span className="text-green-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(totalAmount)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
