import { Metadata } from 'next'
import { Farmer, FarmerProduce, ProduceCategory } from '@/payload-types'
import { auth } from '@clerk/nextjs/server'
import { Suspense } from 'react'

import { Header } from '@/components/global/header/header'
import {
  PayloadQueryBuilder,
  getPaginationParams,
  getSortParams,
} from '@/lib/payload/query-builder'
import { getPayloadClient } from '@/lib/payload/payload-client'
import AuthCTA from './components/auth-cta'
import { ProduceCatalog } from './components/produce-catalog'
import ProduceCatalogSkeleton from './components/produce-catalog-skeleton'
import MapDrawer from '@/components/map/mapSheet'

export const metadata: Metadata = {
  title: 'Agriculture | Labuan Bajo SMART',
  description: 'Browse and shop for local farm produce from Labuan Bajo',
}

export default async function AgriculturePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams

  // Safely extract and convert search parameters
  const pageParam = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page
  const search = Array.isArray(resolvedSearchParams.search)
    ? resolvedSearchParams.search[0]
    : resolvedSearchParams.search
  const category = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams.category
  const sort = Array.isArray(resolvedSearchParams.sort)
    ? resolvedSearchParams.sort[0]
    : resolvedSearchParams.sort

  // Use the helper functions to safely parse pagination and sort params
  const { page, limit } = getPaginationParams(pageParam)
  const { field: sortField, order: sortOrder } = getSortParams(sort)
  // Initialize payload client
  const payload = await getPayloadClient()

  // Fetch all produce categories for filter
  const categories = await payload.find({
    collection: 'produceCategory',
    limit: 100,
  })

  const farmers = await payload.find({
    collection: 'farmers',
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

  // Fetch produce with the built query
  const produceData = await payload.find({
    collection: 'farmerProduce',
    where: queryBuilder.build(),
    page,
    limit,
    depth: 2, // Load farmer, category, and media relationships
  })

  // Build a separate query for newest produce
  const newestProduceData = await payload.find({
    collection: 'farmerProduce',
    sort: '-createdAt',
    limit: 4,
    depth: 2,
  })

  const positionList = farmers.docs.map((farmer: Farmer) => {
    return {
      lat: farmer.location.geo[0],
      lng: farmer.location.geo[1],
    }
  })
  // Check if user is authenticated
  const { userId } = await auth()

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 w-full flex justify-between items-center">
          <h2 className="text-2xl font-bold">Browse Farm Produce</h2>
          <MapDrawer
            position={positionList}
            defaultCenter={{ lat: -8.717027711456385, lng: 120.14788876527878 }}
          />
        </div>

        {/* Section 1: Newest Produce with CTA */}
        {/* <NewestProduce produce={newestProduceData.docs as FarmerProduce[]} /> */}

        {/* Section 2: Produce Catalog with Filters, Search, and Pagination */}
        <Suspense fallback={<ProduceCatalogSkeleton />}>
          <ProduceCatalog
            produce={produceData.docs as FarmerProduce[]}
            categories={categories.docs as ProduceCategory[]}
            totalPages={Math.ceil(produceData.totalDocs / limit)}
            currentPage={page}
            totalProduce={produceData.totalDocs}
            searchQuery={search || ''}
            selectedCategory={category || ''}
          />
        </Suspense>

        {/* Section 3: Conditional Auth CTA */}
        {!userId && <AuthCTA />}
      </div>
    </>
  )
}
