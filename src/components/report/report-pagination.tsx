'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

interface ReportPaginationProps {
  currentPage: number
  totalPages: number
}

export function ReportPagination({ currentPage, totalPages }: ReportPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString())

    // Update the page parameter
    params.set('page', page.toString())

    // Navigate to the new URL with updated search params
    router.push(`?${params.toString()}`)
  }

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    // Logic to determine which page numbers to show
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page, last page, current page, and pages adjacent to current
      const adjacentPages = Math.floor((maxPagesToShow - 3) / 2)

      // Add first page
      pageNumbers.push(1)

      // Add pages before current page
      let startPage = Math.max(2, currentPage - adjacentPages)

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push(-1) // -1 represents ellipsis
      }

      // Add pages around current page
      for (let i = startPage; i <= Math.min(totalPages - 1, currentPage + adjacentPages); i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i)
        }
      }

      // Add ellipsis if needed
      if (currentPage + adjacentPages < totalPages - 1) {
        pageNumbers.push(-2) // -2 represents ellipsis
      }

      // Add last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex justify-center">
      <ul className="flex items-center gap-1">
        {/* Previous Page Button */}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => {
          // Render ellipsis
          if (pageNum < 0) {
            return (
              <li key={`ellipsis-${index}`} className="px-2">
                <span className="text-muted-foreground">...</span>
              </li>
            )
          }

          // Render page number
          return (
            <li key={pageNum}>
              <Button
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigateToPage(pageNum)}
                className="min-w-[40px]"
                aria-label={`Page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </Button>
            </li>
          )
        })}

        {/* Next Page Button */}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}
