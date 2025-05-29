import { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Facility } from '@/payload-types'
import { FacilityFilters } from './components/facility-filters'
import { FacilityGrid } from './components/facility-grid'
import { FacilityPagination } from './components/facility-pagination'
import { Header } from '@/components/global/header/header'

export const metadata: Metadata = {
  title: 'Public Facilities | Labuan Bajo SMART',
  description: 'Find public facilities and services in Labuan Bajo',
}

interface FacilityPageProps {
  searchParams: {
    page?: string
    sector?: string
    search?: string
  }
}

const ITEMS_PER_PAGE = 9

export default async function FacilityPage({ searchParams }: FacilityPageProps) {
  // Parse search parameters
  const { page, sector, search } = await searchParams

  // Get PayloadCMS client
  const payload = await getPayloadClient()

  // Build query conditions
  const queryConditions: any = {
    isArchived: { equals: false },
  }

  // Add sector filter if specified
  if (sector) {
    queryConditions.sector = { equals: sector }
  }

  // Add search filter if specified
  if (search) {
    queryConditions.name = { contains: search }
  }

  // Fetch facilities with pagination
  const facilitiesResponse = await payload.find({
    collection: 'facility',
    where: queryConditions,
    page: page ? Number(page) : 1,
    limit: ITEMS_PER_PAGE,
    depth: 1, // To resolve logo reference
  })

  const facilities = facilitiesResponse.docs as Facility[]
  const totalPages = Math.ceil(facilitiesResponse.totalDocs / ITEMS_PER_PAGE)

  // Get all sectors for filter options
  const sectors = ['HEALTH', 'EDUCATION', 'GOVERNMENT', 'PUBLIC_SERVICE', 'INFRASTRUCTURE']

  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="w-full p-10">
        {/* Page Header */}
        <h1 className="text-2xl font-bold mb-4">Public Facilities</h1>
        <p className="text-muted-foreground mb-6">
          Find public facilities and services in Labuan Bajo
        </p>

        {/* Filters Section */}
        <FacilityFilters sectors={sectors} activeSector={sector} searchQuery={search || ''} />

        {/* Facilities Grid */}
        <FacilityGrid facilities={facilities} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <FacilityPagination
              currentPage={page ? Number(page) : 1}
              totalPages={totalPages}
              searchParams={searchParams}
            />
          </div>
        )}
      </div>
    </div>
  )
}
