import { Suspense } from 'react'
import { Metadata } from 'next'

import { Header } from '@/components/global/header/header'
import { NewsPageHeader } from '@/components/news/news-page-header'
import { NewsFilter } from '@/components/news/news-filter'
import { NewsGrid } from '@/components/news/news-grid'
import { NewsPagination } from '@/components/news/news-pagination'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { News, NewsCategory } from '@/payload-types'

export const metadata: Metadata = {
  title: 'News & Articles | Labuan Bajo',
  description: 'Stay updated with the latest news and articles from Labuan Bajo',
}

interface NewsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const payload = await getPayloadClient()

  // Parse search parameters - await the Promise and safely extract values
  const resolvedSearchParams = await searchParams

  // Safely extract and convert search parameters
  const category = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams.category
  const query = Array.isArray(resolvedSearchParams.query)
    ? resolvedSearchParams.query[0]
    : resolvedSearchParams.query
  const page = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page

  const categoryId = category
  const searchQuery = query || ''
  const currentPage = Number(page) || 1
  const perPage = 9 // 9 items per page based on the grid design

  // Fetch categories for filter
  const categoriesResponse = await payload.find({
    collection: 'newsCategory',
    where: {
      isArchived: {
        equals: false,
      },
    },
  })

  const categories = categoriesResponse.docs as NewsCategory[]

  // Build query for news articles
  const newsQuery: any = {
    limit: perPage,
    page: currentPage,
    depth: 2, // To get nested data like categories and media
    where: {},
    sort: '-createdAt', // Sort by newest first
  }

  // Add category filter if selected
  if (categoryId) {
    newsQuery.where['meta.category'] = {
      contains: categoryId,
    }
  }

  // Add search filter if query provided
  if (searchQuery) {
    newsQuery.where.meta = {
      ...(newsQuery.where.meta || {}),
      title: {
        like: searchQuery,
      },
    }
  }

  // Fetch news articles
  const newsResponse = await payload.find({
    collection: 'news',
    ...newsQuery,
  })

  const headline = newsResponse.docs[0] as News
  const news = newsResponse.docs as News[]

  // Convert searchParams to format expected by NewsPagination
  const paginationSearchParams = {
    category: category || undefined,
    query: query || undefined,
    page: page || undefined,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <NewsPageHeader />

        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-muted rounded-md" />}>
          <NewsFilter
            categories={categories}
            activeCategory={categoryId}
            searchQuery={searchQuery}
          />
        </Suspense>

        <Suspense fallback={<div className="h-96 w-full animate-pulse bg-muted rounded-md mt-8" />}>
          <NewsGrid news={news} />
        </Suspense>

        {newsResponse.totalPages > 1 && (
          <NewsPagination
            currentPage={currentPage}
            totalPages={newsResponse.totalPages}
            searchParams={paginationSearchParams}
          />
        )}
      </main>
    </div>
  )
}
