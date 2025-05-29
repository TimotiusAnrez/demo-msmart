'use client'

import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface FacilityPaginationProps {
  currentPage: number
  totalPages: number
  searchParams?: {
    page?: string
    sector?: string
    search?: string
    [key: string]: string | undefined
  }
}

export function FacilityPagination({
  currentPage,
  totalPages,
  searchParams = {},
}: FacilityPaginationProps) {
  // Create page range to display
  const getPageRange = () => {
    const range: (number | null)[] = []

    // Always show page 1
    range.push(1)

    // Calculate start and end of the range around current page
    let rangeStart = Math.max(2, currentPage - 1)
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    // Handle special cases
    if (currentPage <= 3) {
      rangeEnd = Math.min(4, totalPages - 1)
    } else if (currentPage >= totalPages - 2) {
      rangeStart = Math.max(totalPages - 3, 2)
    }

    // Add ellipsis before the range if needed
    if (rangeStart > 2) range.push(null)

    // Add pages in the range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      range.push(i)
    }

    // Add ellipsis after the range if needed
    if (rangeEnd < totalPages - 1) range.push(null)

    // Always show last page if there's more than one page
    if (totalPages > 1) range.push(totalPages)

    return range
  }

  // Build URL with current search parameters and new page
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()

    // Copy existing parameters
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    }

    // Add page parameter if not page 1
    if (page > 1) {
      params.set('page', page.toString())
    }

    const queryString = params.toString()
    return `/facility${queryString ? `?${queryString}` : ''}`
  }

  const pageRange = getPageRange()

  if (totalPages <= 1) return null

  return (
    <nav className="mx-auto flex w-full justify-center" role="navigation" aria-label="pagination">
      <ul className="flex flex-row items-center gap-1">
        {/* Previous Page Button */}
        {currentPage > 1 && (
          <li>
            <Link
              href={getPageUrl(currentPage - 1)}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  size: 'default',
                }),
                'gap-1 px-2.5',
              )}
              aria-label="Go to previous page"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Previous</span>
            </Link>
          </li>
        )}

        {/* Page Numbers */}
        {pageRange.map((page, i) => {
          if (page === null) {
            return (
              <li key={`ellipsis-${i}`}>
                <span className="flex h-10 w-10 items-center justify-center" aria-hidden="true">
                  <MoreHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">More pages</span>
                </span>
              </li>
            )
          }

          return (
            <li key={page}>
              <Link
                href={getPageUrl(page)}
                className={cn(
                  buttonVariants({
                    variant: page === currentPage ? 'outline' : 'ghost',
                    size: 'icon',
                  }),
                )}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            </li>
          )
        })}

        {/* Next Page Button */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={getPageUrl(currentPage + 1)}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  size: 'default',
                }),
                'gap-1 px-2.5',
              )}
              aria-label="Go to next page"
            >
              <span className="hidden sm:inline-block">Next</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
