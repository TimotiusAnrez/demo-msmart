'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { revalidatePath } from 'next/cache'
import { ProductVariant, ShopProduct } from '@/payload-types'

type AddToCartParams = {
  productId: number
  variantId?: number
  quantity: number
}

type AddToCartResponse = {
  success: boolean
  error?: string
}

export async function addToCart({
  productId,
  variantId,
  quantity,
}: AddToCartParams): Promise<AddToCartResponse> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        error: 'You must be logged in to add items to your cart',
      }
    }
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    const payloadUserID = user.privateMetadata.payloadID
    const cartID = user.privateMetadata.cartID

    if (!payloadUserID || !cartID) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    const payload = await getPayloadClient()

    if (
      !variantId ||
      typeof variantId !== 'number' ||
      !productId ||
      typeof productId !== 'number'
    ) {
      return {
        success: false,
        error: 'Variant not found',
      }
    }

    const userPayload = await payload.findByID({
      collection: 'users',
      id: Number(payloadUserID),
      depth: 2,
    })

    const product = (await payload.findByID({
      collection: 'shopProducts',
      id: productId,
      depth: 2,
      select: {
        owner: true,
        variantList: true,
        information: true,
      },
    })) as ShopProduct

    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      }
    }

    if (!product.variantList?.docs || !product.variantList.docs.length) {
      return {
        success: false,
        error: 'Variant not found',
      }
    }

    const variant = product.variantList?.docs.find((variant) => {
      if (typeof variant === 'number') return variant === variantId
      return variant.id === variantId
    }) as ProductVariant

    const cartItem = await payload.create({
      collection: 'cartItems',
      data: {
        cart: userPayload,
        product: product,
        variant: variant,
        quantity,
      },
    })
    // Create a new cart item
    // Create a new cart item - only include variant if it exists

    // Revalidate cart pages to reflect changes
    revalidatePath('/cart')
    revalidatePath('/shopping')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return {
      success: false,
      error: 'Failed to add item to cart',
    }
  }
}
