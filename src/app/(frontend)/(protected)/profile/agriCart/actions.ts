'use server'

import { getPayloadClient } from '@/lib/payload/payload-client'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { FarmerProduce } from '@/payload-types'

// Types for add to agri cart
type AddToAgriCartParams = {
  produceId: number
  quantity: number
}

type AddToAgriCartResponse = {
  success: boolean
  error?: string
}

// Types for update agri cart item
type UpdateAgriCartItemParams = {
  itemId: number
  quantity: number
}

type UpdateAgriCartItemResponse = {
  success: boolean
  error?: string
}

// Types for remove agri cart item
type RemoveAgriCartItemParams = {
  itemId: number
}

type RemoveAgriCartItemResponse = {
  success: boolean
  error?: string
}

// Types for checkout
type CheckoutAgriItem = {
  name: string
  price: number
  quantity: number
  unit: string
  farmer: string
}

type CheckoutAgriParams = {
  farmerId: number
  items: CheckoutAgriItem[]
}

type CheckoutAgriResponse = {
  success: boolean
  whatsappUrl?: string
  error?: string
}

/**
 * Add an item to the agri cart
 */
export async function addToAgriCart({
  produceId,
  quantity,
}: AddToAgriCartParams): Promise<AddToAgriCartResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const payload = await getPayloadClient()

    // Get user's agriCartID from Clerk metadata
    const { clerkClient } = await import('@clerk/nextjs/server')
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const agriCartId = user.privateMetadata.agriCartID as number

    if (!agriCartId) {
      return { success: false, error: 'AgriCart not found. Please complete onboarding.' }
    }

    // Check if item already exists in cart
    const existingItems = await payload.find({
      collection: 'agriCartItems',
      where: {
        and: [{ agriCart: { equals: agriCartId } }, { produce: { equals: produceId } }],
      },
    })

    if (existingItems.docs.length > 0) {
      // Item already exists, update quantity
      const existingItem = existingItems.docs[0]
      const newQuantity = existingItem.quantity + quantity

      await payload.update({
        collection: 'agriCartItems',
        id: existingItem.id,
        data: {
          quantity: newQuantity,
        },
      })
    } else {
      // Item doesn't exist, create new cart item
      await payload.create({
        collection: 'agriCartItems',
        data: {
          agriCart: agriCartId,
          produce: produceId,
          quantity: quantity,
        },
      })
    }

    // Revalidate the agriCart page to reflect changes
    revalidatePath('/profile/agriCart')

    return { success: true }
  } catch (error) {
    console.error('Error adding to agri cart:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
}

/**
 * Update the quantity of an item in the agri cart
 */
export async function updateAgriCartItem({
  itemId,
  quantity,
}: UpdateAgriCartItemParams): Promise<UpdateAgriCartItemResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    if (quantity <= 0) {
      return { success: false, error: 'Quantity must be greater than 0' }
    }

    const payload = await getPayloadClient()

    // Update the agri cart item
    await payload.update({
      collection: 'agriCartItems',
      id: itemId,
      data: {
        quantity,
      },
    })

    // Revalidate the agri cart page to show updated data
    revalidatePath('/profile/agriCart')

    return { success: true }
  } catch (error) {
    console.error('Error updating agri cart item:', error)
    return { success: false, error: 'Failed to update cart item' }
  }
}

/**
 * Remove an item from the agri cart
 */
export async function removeAgriCartItem({
  itemId,
}: RemoveAgriCartItemParams): Promise<RemoveAgriCartItemResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const payload = await getPayloadClient()

    // Delete the agri cart item
    await payload.delete({
      collection: 'agriCartItems',
      id: itemId,
    })

    // Revalidate the agri cart page to show updated data
    revalidatePath('/profile/agriCart')

    return { success: true }
  } catch (error) {
    console.error('Error removing agri cart item:', error)
    return { success: false, error: 'Failed to remove cart item' }
  }
}

/**
 * Checkout process for agri cart - generates WhatsApp message with cart details
 */
export async function checkoutAgriCart({
  farmerId,
  items,
}: CheckoutAgriParams): Promise<CheckoutAgriResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'No items to checkout' }
    }

    const payload = await getPayloadClient()

    // Get farmer information
    const farmer = await payload.findByID({
      collection: 'farmers',
      id: farmerId,
      depth: 1,
    })

    if (!farmer) {
      return { success: false, error: 'Farmer not found' }
    }

    // Generate WhatsApp message
    let message = `🌾 *Agricultural Produce Order*\n\n`
    message += `*Farmer:* ${farmer.fullName || 'Unknown'}\n`
    message += `*Date:* ${new Date().toLocaleDateString()}\n\n`
    message += `*Items Ordered:*\n`

    let totalAmount = 0

    items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity
      totalAmount += itemTotal

      message += `${index + 1}. *${item.name}*\n`
      message += `   Quantity: ${item.quantity} ${item.unit}\n`
      message += `   Price: ${formatPrice(item.price)} per ${item.unit}\n`
      message += `   Subtotal: ${formatPrice(itemTotal)}\n\n`
    })

    message += `*Total Amount: ${formatPrice(totalAmount)}*\n\n`
    message += `Please confirm this order and let me know the delivery details. Thank you! 🙏`

    // Generate WhatsApp URL
    const phoneNumber = farmer.contact.phone || ''
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    return {
      success: true,
      whatsappUrl,
    }
  } catch (error) {
    console.error('Error during agri cart checkout:', error)
    return { success: false, error: 'Failed to process checkout' }
  }
}

/**
 * Helper function to format price
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}
