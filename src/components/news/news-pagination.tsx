'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'

interface NewsPaginationProps {
  currentPage: number
  totalPages: number
  searchParams: {
    category?: string
    query?: string
    page?: string
  }
}

export function NewsPagination({ currentPage, totalPages, searchParams }: NewsPaginationProps) {
  const router = useRouter()

  // Generate pagination URL with current search params
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams()

    // Preserve existing search parameters
    if (searchParams.category) {
      params.set('category', searchParams.category)
    }

    if (searchParams.query) {
      params.set('query', searchParams.query)
    }

    // Set the page parameter
    params.set('page', pageNumber.toString())

    return `/news?${params.toString()}`
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate start and end of the current range
    let rangeStart = Math.max(2, currentPage - 1)
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      pageNumbers.push('ellipsis-start')
    }

    // Add range of pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push('ellipsis-end')
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        {/* Previous Page Button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(createPageURL(currentPage - 1))}
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((page, i) =>
          typeof page === 'number' ? (
            <PaginationItem key={i}>
              <Button
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => router.push(createPageURL(page))}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </Button>
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}

        {/* Next Page Button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(createPageURL(currentPage + 1))}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
