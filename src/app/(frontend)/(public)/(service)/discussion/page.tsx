import { Metadata } from 'next'
import { Plus } from 'lucide-react'

import { Header } from '@/components/global/header/header'
import { Button } from '@/components/ui/button'
import { DiscussionSearch } from '@/components/discussion/discussion-search'
import { DiscussionList } from '@/components/discussion/discussion-list'
import { CreateDiscussionDialog } from '@/components/discussion/create-discussion-dialog'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Discussion, DiscussionCategory } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Discussions | Labuan Bajo Smart',
  description: 'Join conversations with other members of the Labuan Bajo community',
}

interface DiscussionPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DiscussionPage({ searchParams }: DiscussionPageProps) {
  // Parse search parameters - await the Promise and safely extract values
  const resolvedSearchParams = await searchParams

  // Safely extract and convert search parameters
  const query = Array.isArray(resolvedSearchParams.query)
    ? resolvedSearchParams.query[0]
    : resolvedSearchParams.query
  const category = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams.category
  const page = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page

  const currentPage = parseInt(page || '1')
  const payload = await getPayloadClient()

  // Fetch discussion categories
  const categoriesResponse = await payload.find({
    collection: 'discussionCategories',
    where: {
      isArchived: {
        equals: false,
      },
    },
    limit: 100,
  })

  const categories = categoriesResponse.docs as DiscussionCategory[]

  // Build query to fetch discussions
  const where: Record<string, any> = {
    status: {
      equals: 'OPEN',
    },
  }

  // Add search query if provided
  if (query) {
    where.or = [
      {
        title: {
          like: query,
        },
      },
      {
        content: {
          like: query,
        },
      },
    ]
  }

  // Add category filter if provided
  if (category) {
    where.category = {
      contains: category,
    }
  }

  // Fetch discussions with pagination
  const limit = 10
  const discussionsResponse = await payload.find({
    collection: 'discussion',
    where,
    sort: '-createdAt', // Newest first
    page: currentPage,
    limit,
    depth: 2, // Get author and category data
  })

  const discussions = discussionsResponse.docs as Discussion[]
  const totalPages = Math.ceil(discussionsResponse.totalDocs / limit)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Page Header with Title and Create Button */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discussions</h1>
            <p className="mt-1 text-muted-foreground">
              Join conversations with other members of the Labuan Bajo community
            </p>
          </div>

          <CreateDiscussionDialog categories={categories}>
            <Button size="sm" className="gap-1 hover:cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>New Discussion</span>
            </Button>
          </CreateDiscussionDialog>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <DiscussionSearch categories={categories} />
        </div>

        {/* Discussion List */}
        <DiscussionList
          discussions={discussions}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </main>
    </div>
  )
}
