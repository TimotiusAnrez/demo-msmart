import { getPayloadClient } from '@/lib/payload/payload-client'
import { notFound } from 'next/navigation'

export default async function DestinationPage({
  params,
}: {
  params: {
    id: string
  }
}) {
  const { id } = await params

  // Initialize payload client
  const payload = await getPayloadClient()

  // Fetch the destination by ID
  const destination = await payload.findByID({
    collection: 'locations',
    id,
  })

  // If no destination found, redirect to 404
  if (!destination) {
    return notFound()
  }

  return (
    <div>
      <h1>{destination.name}</h1>
      <p>{destination.description}</p>
    </div>
  )
}
