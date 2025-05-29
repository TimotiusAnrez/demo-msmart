import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Header } from '@/components/global/header/header'
import { FarmerProduce, Farmer } from '@/payload-types'
import FarmerDetail from './components/farmer-detail'
import RelatedProduce from './components/related-produce'
import { auth } from '@clerk/nextjs/server'

type Props = {
  params: {
    id: string // Farmer ID
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const payload = await getPayloadClient()

  const { id } = await params

  try {
    const farmer = (await payload.findByID({
      collection: 'farmers',
      id,
      depth: 0,
    })) as Farmer

    return {
      title: `${farmer.personal.firstName} ${farmer.personal.lastName} | Labuan Bajo SMART`,
      description: `Browse and buy fresh produce from ${farmer.personal.firstName} ${farmer.personal.lastName}`,
    }
  } catch (error) {
    return {
      title: 'Farmer | Labuan Bajo SMART',
      description: 'Browse and buy fresh produce from local farmers',
    }
  }
}

export default async function FarmerPage({ params }: Props) {
  const { id } = params
  const { userId } = await auth()
  const isAuthenticated = Boolean(userId)

  const payload = await getPayloadClient()

  // Fetch the farmer
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

  // Fetch farmer's produce
  let farmerProduce: FarmerProduce[] = []
  try {
    const produceData = await payload.find({
      collection: 'farmerProduce',
      where: {
        farmer: {
          equals: id,
        },
      },
      depth: 1,
    })

    farmerProduce = produceData.docs as FarmerProduce[]
  } catch (error) {
    console.error('Error fetching farmer produce:', error)
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FarmerDetail farmer={farmer} produce={farmerProduce} isAuthenticated={isAuthenticated} />

        {farmerProduce.length > 1 && (
          <RelatedProduce
            produce={farmerProduce.slice(0, 3)}
            farmerId={Number(id)}
            farmerName={`${farmer.personal.firstName} ${farmer.personal.lastName}`}
          />
        )}
      </main>
    </>
  )
}
