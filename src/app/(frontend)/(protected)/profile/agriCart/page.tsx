import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { ProfileHeader } from '@/components/profile/profile-header'
import AgriCartContent from './components/agri-cart-content'
import AgriCartContentSkeleton from './components/agri-cart-content-skeleton'
import { AgriCartItem, FarmerProduce } from '@/payload-types'
import Link from 'next/link'

export default async function AgriCartPage() {
  const { userId } = await auth()

  // Redirect unauthenticated users to the sign-in page
  if (!userId) {
    redirect('/sign-in')
  }

  // Get payload user ID and agri cart ID from clerk user metadata
  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const payloadUserId = user.privateMetadata.payloadID as number
  const agriCartId = user.privateMetadata.agriCartID as number

  if (!payloadUserId || !agriCartId) {
    // Handle the case where the user doesn't have an agri cart yet
    return (
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader title="Agricultural Cart" />
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your agricultural cart is empty
          </h3>
          <p className="text-muted-foreground mb-4">
            Browse our fresh produce and add items to your cart.
          </p>
          <Link
            href="/agriculture"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Browse Agricultural Products
          </Link>
        </div>
      </div>
    )
  }

  const payload = await getPayloadClient()

  // Fetch the user's agri cart with all items
  const agriCart = await payload.findByID({
    collection: 'agriCart',
    id: agriCartId,
    depth: 4, // Deep fetch to get produce and farmer details
  })

  // Pass the raw cart items to the client component
  let cartItems: Promise<AgriCartItem>[] = []
  let endValue: AgriCartItem[] = []

  try {
    if (!agriCart.agriCartItemList?.docs) throw new Error('Agri cart items not found')

    cartItems = agriCart.agriCartItemList?.docs?.map(async (item) => {
      if (typeof item === 'number') {
        // Fetch the full item if it's just an ID
        const data = await payload.findByID({
          collection: 'agriCartItems',
          id: item,
          depth: 4,
        })
        return data as AgriCartItem
      }

      // Item is already an object, construct the proper AgriCartItem
      const data: AgriCartItem = {
        id: item.id,
        quantity: item.quantity,
        produce: item.produce,
        agriCart: item.agriCart,
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
      }

      // Fetch the full produce details with farmer information
      const produce = await payload.findByID({
        collection: 'farmerProduce',
        id: data.produce as number,
        depth: 4,
      })

      // Update the data with the fetched produce
      const updatedData: AgriCartItem = {
        id: item.id,
        quantity: item.quantity,
        produce: produce as FarmerProduce,
        agriCart: item.agriCart as number,
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
      }

      return updatedData
    })
  } catch (error) {
    console.error('Error fetching agri cart items:', error)
  } finally {
    endValue = await Promise.all(cartItems)
    console.log('AgriCart items:', endValue)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader title="Agricultural Cart" />

      <Suspense fallback={<AgriCartContentSkeleton />}>
        <AgriCartContent cartItems={endValue} />
      </Suspense>
    </div>
  )
}
