import { Metadata } from 'next'
import { Location, LocationCategory } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { PayloadQueryBuilder, getPaginationParams } from '@/lib/payload/query-builder'
import { Header } from '@/components/global/header/header'
import { TopDestinations } from './components/top-destinations'
import { PlanTrip } from './components/plan-trip'
import { DestinationExplore } from './components/destination-explore'

export const metadata: Metadata = {
  title: 'Tourism Destinations | Labuan Bajo SMART',
  description: 'Explore the best tourism destinations in and around Labuan Bajo',
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    category?: string
    search?: string
  }
}) {
  const { page: pageParam, category, search } = await searchParams

  // Use helper functions to safely parse pagination params
  const { page, limit } = getPaginationParams(pageParam, 1, 6)

  // Initialize payload client
  const payload = await getPayloadClient()

  // Fetch all location categories for filtering
  const categories = await payload.find({
    collection: 'locationCategories',
    limit: 100,
  })

  // Build the query using the query builder
  const queryBuilder = PayloadQueryBuilder.create()

  // Add search condition if search term is provided
  if (search && search.trim() !== '') {
    queryBuilder.like('name', search.trim())
  }

  // Add category filter if category is provided
  if (category && category.trim() !== '') {
    queryBuilder.equals('category', category.trim())
  }

  // Fetch locations with the built query
  const locationsData = await payload.find({
    collection: 'locations',
    where: queryBuilder.build(),
    page,
    limit,
    depth: 2, // Load category and media relationships
  })

  // Fetch featured/top destinations (for example, taking most recent 5)
  const topDestinationsData = await payload.find({
    collection: 'locations',
    sort: '-createdAt',
    limit: 5,
    depth: 2,
  })

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Section 1: Top Destinations */}
        {/* <TopDestinations destinations={topDestinationsData.docs as Location[]} /> */}

        {/* Section 2: Plan Your Trip */}
        <PlanTrip />

        {/* Section 3: Explore More Destinations */}
        <DestinationExplore
          destinations={locationsData.docs as Location[]}
          categories={categories.docs as LocationCategory[]}
          totalPages={Math.ceil(locationsData.totalDocs / limit)}
          currentPage={page}
          totalDestinations={locationsData.totalDocs}
          selectedCategory={category || ''}
          searchQuery={search || ''}
        />
      </main>
    </>
  )
}
