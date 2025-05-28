import { Metadata } from 'next'
import { Plus } from 'lucide-react'

import { Header } from '@/components/global/header/header'
import { Button } from '@/components/ui/button'
import { ReportSearch } from '@/components/report/report-search'
import { ReportList } from '@/components/report/report-list'
import { CreateReportDialog } from '@/components/report/create-report-dialog'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Report, ReportCategory } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Reports | Labuan Bajo Smart',
  description: 'Submit and track reports for issues in the Labuan Bajo community',
}

interface ReportPageProps {
  searchParams: {
    query?: string
    category?: string
    page?: string
  }
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const { query, category, page = '1' } = await searchParams
  const currentPage = parseInt(page)
  const payload = await getPayloadClient()

  // Fetch report categories
  const categoriesResponse = await payload.find({
    collection: 'reportCategories',
    where: {
      isArchived: {
        equals: false,
      },
    },
    limit: 100,
  })

  const categories = categoriesResponse.docs as ReportCategory[]

  // Build query to fetch reports
  const where: Record<string, any> = {
    status: {
      not_equals: 'CLOSED',
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

  // Fetch reports with pagination
  const limit = 10
  const reportsResponse = await payload.find({
    collection: 'reports',
    where,
    sort: '-createdAt', // Newest first
    page: currentPage,
    limit,
    depth: 2, // Get author and category data
  })

  const reports = reportsResponse.docs as Report[]
  const totalPages = Math.ceil(reportsResponse.totalDocs / limit)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Page Header with Title and Create Button */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="mt-1 text-muted-foreground">
              Submit and track reports for issues in the Labuan Bajo community
            </p>
          </div>

          <CreateReportDialog categories={categories}>
            <Button size="sm" className="gap-1 hover:cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>New Report</span>
            </Button>
          </CreateReportDialog>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <ReportSearch categories={categories} />
        </div>

        {/* Report List */}
        <ReportList reports={reports} currentPage={currentPage} totalPages={totalPages} />
      </main>
    </div>
  )
}
