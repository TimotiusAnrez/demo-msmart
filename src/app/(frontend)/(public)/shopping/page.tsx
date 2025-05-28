import { Metadata } from 'next'
import { ShopProduct, ShopProductCategory } from '@/payload-types'
import { auth } from '@clerk/nextjs/server'
import { Suspense } from 'react'

import { NewestProducts } from './components/newest-products'
import { ProductCatalog } from './components/product-catalog'
import AuthCTA from './components/auth-cta'
import ProductCatalogSkeleton from './components/product-catalog-skeleton'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Header } from '@/components/global/header/header'
import {
  PayloadQueryBuilder,
  getPaginationParams,
  getSortParams,
} from '@/lib/payload/query-builder'

export const metadata: Metadata = {
  title: 'Shopping | Labuan Bajo SMART',
  description: 'Browse and shop for local products from Labuan Bajo',
}

export default async function ShoppingPage({
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
  // const sortOptions = getSortParams(sort, 'createdAt', 'desc')

  // Initialize payload client
  const payload = await getPayloadClient()

  // Fetch all product categories for filter
  const categories = await payload.find({
    collection: 'shopProductCategory',
    limit: 100,
  })

  // Build the query using the query builder
  const queryBuilder = PayloadQueryBuilder.create()

  // Add search condition if search term is provided
  if (search && search.trim() !== '') {
    queryBuilder.nested('information.name', 'like', search.trim())
  }

  // Add category filter if category is provided
  if (category && category.trim() !== '') {
    queryBuilder.equals('category', category.trim())
  }

  // Fetch products with the built query
  const productsData = await payload.find({
    collection: 'shopProducts',
    where: queryBuilder.build(),
    // sort: '-information.defaultPrice',
    page,
    limit,
    depth: 2, // Load owner, category, and media relationships
  })

  // Build a separate query for newest products
  const newestProductsQuery = PayloadQueryBuilder.create()
  const newestProductsData = await payload.find({
    collection: 'shopProducts',
    // sort: '-createdAt',
    limit: 4,
    depth: 2,
  })

  // Check if user is authenticated
  const { userId } = await auth()

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Section 1: Newest Products with CTA */}
        <NewestProducts products={newestProductsData.docs as ShopProduct[]} />

        {/* Section 2: Product Catalog with Filters, Search, Sort, and Pagination */}
        <Suspense fallback={<ProductCatalogSkeleton />}>
          <ProductCatalog
            products={productsData.docs as ShopProduct[]}
            categories={categories.docs as ShopProductCategory[]}
            totalPages={Math.ceil(productsData.totalDocs / limit)}
            currentPage={page}
            totalProducts={productsData.totalDocs}
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
