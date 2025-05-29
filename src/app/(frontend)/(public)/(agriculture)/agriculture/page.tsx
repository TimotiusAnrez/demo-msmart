import { Metadata } from 'next'
import { FarmerProduce, ProduceCategory } from '@/payload-types'
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
import { NewestProduce } from './components/newest-produce'

export const metadata: Metadata = {
  title: 'Agriculture | Labuan Bajo SMART',
  description: 'Browse and shop for local farm produce from Labuan Bajo',
}

export default async function AgriculturePage({
  searchParams,
}: {
  searchParams: {
    page?: string
    search?: string
    sort?: string
    category?: string
  }
}) {
  const { page: pageParam, search, category } = await searchParams

  // Use the helper functions to safely parse pagination and sort params
  const { page, limit } = getPaginationParams(pageParam, 1, 12)

  // Initialize payload client
  const payload = await getPayloadClient()

  // Fetch all produce categories for filter
  const categories = await payload.find({
    collection: 'produceCategory',
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

  // Check if user is authenticated
  const { userId } = await auth()

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
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
