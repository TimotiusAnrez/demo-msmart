import { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Facility } from '@/payload-types'
import { FacilityFilters } from './components/facility-filters'
import { FacilityGrid } from './components/facility-grid'
import { FacilityPagination } from './components/facility-pagination'
import { Header } from '@/components/global/header/header'
import MapSheet from '@/components/map/mapSheet'

export const metadata: Metadata = {
  title: 'Public Facilities | Labuan Bajo SMART',
  description: 'Find public facilities and services in Labuan Bajo',
}

interface FacilityPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ITEMS_PER_PAGE = 9

export default async function FacilityPage({ searchParams }: FacilityPageProps) {
  // Parse search parameters - await the Promise and safely extract values
  const resolvedSearchParams = await searchParams

  // Safely extract and convert search parameters
  const page = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page
  const sector = Array.isArray(resolvedSearchParams.sector)
    ? resolvedSearchParams.sector[0]
    : resolvedSearchParams.sector
  const search = Array.isArray(resolvedSearchParams.search)
    ? resolvedSearchParams.search[0]
    : resolvedSearchParams.search

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
  const facilityPosition = facilities.map((facility: Facility) => {
    return {
      lat: facility.location.geo[0],
      lng: facility.location.geo[1],
    }
  })

  // Get all sectors for filter options
  const sectors = ['HEALTH', 'EDUCATION', 'GOVERNMENT', 'PUBLIC_SERVICE', 'INFRASTRUCTURE']

  // Convert searchParams to format expected by FacilityPagination
  const paginationSearchParams = {
    page: page || undefined,
    sector: sector || undefined,
    search: search || undefined,
  }

  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="w-full p-10">
        {/* Page Header */}
        <div className="header w-full flex justify-between items-center">
          <div className="copy">
            <h1 className="text-2xl font-bold mb-4">Public Facilities</h1>
            <p className="text-muted-foreground mb-6">
              Find public facilities and services in Labuan Bajo
            </p>
          </div>
          <MapSheet position={facilityPosition} />
        </div>

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
              searchParams={paginationSearchParams}
            />
          </div>
        )}
      </div>
    </div>
  )
}
