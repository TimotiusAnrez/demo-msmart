'use server'

import { getPayloadClient } from '@/lib/payload/payload-client'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

// Types for update cart item
type UpdateCartItemParams = {
  itemId: number
  quantity: number
}

type UpdateCartItemResponse = {
  success: boolean
  error?: string
}

// Types for remove cart item
type RemoveCartItemParams = {
  itemId: number
}

type RemoveCartItemResponse = {
  success: boolean
  error?: string
}

// Types for checkout
type CheckoutItem = {
  name: string
  price: number
  quantity: number
}

type CheckoutParams = {
  shopId: number
  items: CheckoutItem[]
}

type CheckoutResponse = {
  success: boolean
  whatsappUrl?: string
  error?: string
}

/**
 * Update the quantity of an item in the cart
 */
export async function updateCartItem({
  itemId,
  quantity,
}: UpdateCartItemParams): Promise<UpdateCartItemResponse> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        error: 'You must be logged in to update your cart',
      }
    }

    const payload = await getPayloadClient()

    // Update the cart item
    await payload.update({
      collection: 'cartItems',
      id: itemId,
      data: {
        quantity,
      },
    })

    // Revalidate cart page
    revalidatePath('/cart')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error updating cart item:', error)
    return {
      success: false,
      error: 'Failed to update cart item',
    }
  }
}

/**
 * Remove an item from the cart
 */
export async function removeCartItem({
  itemId,
}: RemoveCartItemParams): Promise<RemoveCartItemResponse> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        error: 'You must be logged in to remove items from your cart',
      }
    }

    const payload = await getPayloadClient()

    // Delete the cart item
    await payload.delete({
      collection: 'cartItems',
      id: itemId,
    })

    // Revalidate cart page
    revalidatePath('/cart')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error removing cart item:', error)
    return {
      success: false,
      error: 'Failed to remove cart item',
    }
  }
}

/**
 * Checkout process - generates WhatsApp message with cart details
 */
export async function checkout({ shopId, items }: CheckoutParams): Promise<CheckoutResponse> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        error: 'You must be logged in to checkout',
      }
    }

    const payload = await getPayloadClient()

    // Get shop details to get phone number
    const shop = await payload.findByID({
      collection: 'shops',
      id: shopId,
    })

    if (!shop) {
      return {
        success: false,
        error: 'Shop not found',
      }
    }

    // Create WhatsApp message
    const phoneNumber = shop.contact?.whatsapp || '6281234567890' // Default fallback

    // Format message for WhatsApp
    let message = `Hello, I would like to order the following items from ${shop.shopName}:\n\n`

    // Add items
    let total = 0
    items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity
      total += lineTotal
      message += `${index + 1}. ${item.name} x${item.quantity} - ${formatPrice(item.price)} = ${formatPrice(lineTotal)}\n`
    })

    // Add total
    message += `\nTotal: ${formatPrice(total)}`

    // Add delivery information
    message += `\n\nPlease deliver to my address on file. Thank you!`

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    return {
      success: true,
      whatsappUrl,
    }
  } catch (error) {
    console.error('Error checking out:', error)
    return {
      success: false,
      error: 'Failed to process checkout',
    }
  }
}

// Helper function to format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price)
}
