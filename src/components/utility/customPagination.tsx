'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationProps {
  currentPage: number
  totalPages: number
  label: string
  paramKey: string
  showPageNumbers?: boolean
  maxVisiblePages?: number
}

export function CustomPagination({
  currentPage,
  totalPages,
  label,
  paramKey,
  showPageNumbers = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Create query string with updated page parameter
  const createQueryString = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())

      if (page <= 1) {
        params.delete(paramKey)
      } else {
        params.set(paramKey, page.toString())
      }

      return params.toString()
    },
    [searchParams, paramKey],
  )

  // Navigate to specific page
  const navigateToPage = useCallback(
    (page: number) => {
      // Validate page number
      if (page < 1 || page > totalPages) return

      const queryString = createQueryString(page)
      const url = queryString ? `${pathname}?${queryString}` : pathname

      router.push(url, { scroll: false })
    },
    [createQueryString, pathname, router, totalPages],
  )

  // Generate visible page numbers
  const getVisiblePages = useCallback(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(currentPage - half, 1)
    const end = Math.min(start + maxVisiblePages - 1, totalPages)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages, maxVisiblePages])

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 2
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Page info */}
      <div className="text-sm text-muted-foreground text-center">
        {label} - Page {currentPage} of {totalPages}
      </div>

      <Pagination>
        <PaginationContent className="flex-wrap gap-1">
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => navigateToPage(currentPage - 1)}
              className={`cursor-pointer ${
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              aria-disabled={currentPage <= 1}
            />
          </PaginationItem>

          {showPageNumbers && (
            <>
              {/* First page */}
              {visiblePages[0] > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => navigateToPage(1)}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    isActive={currentPage === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Start ellipsis */}
              {showStartEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Visible page numbers */}
              {visiblePages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => navigateToPage(page)}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* End ellipsis */}
              {showEndEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page */}
              {visiblePages[visiblePages.length - 1] < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => navigateToPage(totalPages)}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
            </>
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              onClick={() => navigateToPage(currentPage + 1)}
              className={`cursor-pointer ${
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              aria-disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Mobile-friendly page input for large datasets */}
      {totalPages > 10 && (
        <div className="flex items-center gap-2 text-sm">
          <span>Go to page:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            defaultValue={currentPage}
            className="w-16 px-2 py-1 text-center border rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = Number.parseInt((e.target as HTMLInputElement).value)
                if (page >= 1 && page <= totalPages) {
                  navigateToPage(page)
                }
              }
            }}
          />
          <span>of {totalPages}</span>
        </div>
      )}
    </div>
  )
}
