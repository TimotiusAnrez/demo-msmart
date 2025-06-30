import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Header } from '@/components/global/header/header'
import { FarmerProduce, Farmer } from '@/payload-types'
import ProduceDetail from './components/produce-detail'
import SimilarProduce from './components/similar-produce'
import { auth } from '@clerk/nextjs/server'

type Props = {
  params: Promise<{
    id: string // Farmer ID
    produceID: string // Produce ID
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const payload = await getPayloadClient()

  const { produceID } = await params

  try {
    const produce = (await payload.findByID({
      collection: 'farmerProduce',
      id: produceID,
      depth: 0,
    })) as FarmerProduce

    return {
      title: `${produce.name} | Labuan Bajo SMART`,
      description: `Buy ${produce.name} directly from local farmers in Labuan Bajo`,
    }
  } catch (error) {
    return {
      title: 'Produce | Labuan Bajo SMART',
      description: 'Buy fresh produce directly from local farmers',
    }
  }
}

export default async function ProduceDetailPage({ params }: Props) {
  const { id, produceID } = await params
  const { userId } = await auth()
  const isAuthenticated = Boolean(userId)

  const payload = await getPayloadClient()

  // Fetch the produce item
  let produce: FarmerProduce | null = null
  try {
    produce = (await payload.findByID({
      collection: 'farmerProduce',
      id: produceID,
      depth: 2, // Get related data like farmer, category, etc.
    })) as FarmerProduce
  } catch (error) {
    notFound()
  }

  // Check if produce belongs to the farmer
  if (
    typeof produce.farmer === 'number'
      ? produce.farmer !== Number(id)
      : produce.farmer.id !== Number(id)
  ) {
    notFound()
  }

  // Fetch farmer information
  let farmer: Farmer | null = null
  try {
    farmer = (await payload.findByID({
      collection: 'farmers',
      id,
      depth: 0,
    })) as Farmer
  } catch (error) {
    notFound()
  }

  // Fetch similar produce from the same category (limit to 3, exclude current item)
  let similarProduce: FarmerProduce[] = []
  try {
    if (typeof produce.category !== 'number') {
      const categoryId = produce.category.id

      const similarProduceData = await payload.find({
        collection: 'farmerProduce',
        where: {
          category: {
            equals: categoryId,
          },
          id: {
            not_equals: produceID,
          },
        },
        limit: 3,
        depth: 1,
      })

      similarProduce = similarProduceData.docs as FarmerProduce[]
    }
  } catch (error) {
    console.error('Error fetching similar produce:', error)
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProduceDetail produce={produce} farmer={farmer} isAuthenticated={isAuthenticated} />

        {similarProduce.length > 0 && <SimilarProduce produce={similarProduce} />}
      </main>
    </>
  )
}
