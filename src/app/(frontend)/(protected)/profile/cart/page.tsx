import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { ProfileHeader } from '@/components/profile/profile-header'
import CartContent from './components/cart-content'
import CartContentSkeleton from './components/cart-content-skeleton'
import { CartItem, ProductVariant, ShopProduct } from '@/payload-types'

export default async function CartPage() {
  const { userId } = await auth()

  // Redirect unauthenticated users to the sign-in page
  if (!userId) {
    redirect('/sign-in')
  }

  // Get payload user ID and cart ID from clerk user metadata
  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const payloadUserId = user.privateMetadata.payloadID as number
  const cartId = user.privateMetadata.cartID as number

  if (!payloadUserId || !cartId) {
    // Handle the case where the user doesn't have a cart yet
    return (
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader title="Cart" />
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
        </div>
      </div>
    )
  }

  const payload = await getPayloadClient()

  // Fetch the user's cart with all items
  const cart = await payload.findByID({
    collection: 'cart',
    id: cartId,
    depth: 4, // Deep fetch to get product and shop details
  })

  // Pass the raw cart items to the client component
  let cartItems: Promise<CartItem>[] = []
  let endValue: CartItem[] = []
  try {
    if (!cart.cartItemList?.docs) throw new Error('Cart items not found')

    cartItems = cart.cartItemList?.docs?.map(async (item) => {
      if (typeof item === 'number') {
        const data = await payload.findByID({
          collection: 'cartItems',
          id: item,
          depth: 4,
        })
        return data
      }

      const data: CartItem = {
        id: item.id,
        quantity: item.quantity,
        variant: item.variant,
        product: item.product,
        cart: item.cart,
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
      }

      const product = await payload.findByID({
        collection: 'shopProducts',
        id: data.product as number,
        depth: 4,
      })

      const variant = await payload.findByID({
        collection: 'productVariant',
        id: data.variant as number,
        depth: 4,
      })

      const updatedData: CartItem = {
        id: item.id,
        quantity: item.quantity,
        variant: variant as ProductVariant,
        product: product as ShopProduct,
        cart: item.cart as number,
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
      }

      return updatedData
    })
  } catch (error) {
    console.error('Error fetching cart items:', error)
  } finally {
    endValue = await Promise.all(cartItems)
    console.log(endValue)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader title="Cart" />

      <Suspense fallback={<CartContentSkeleton />}>
        <CartContent cartItems={endValue} />
      </Suspense>
    </div>
  )
}
