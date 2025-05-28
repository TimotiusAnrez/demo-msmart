'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductPaginationProps {
  totalPages: number
  currentPage: number
}

export function ProductPagination({ totalPages, currentPage }: ProductPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Create a new URLSearchParams instance to manipulate page param
  const createPageQueryString = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', pageNumber.toString())
      return params.toString()
    },
    [searchParams],
  )

  // Generate pagination items
  const paginationItems = () => {
    const items = []

    // Show first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            href={`${pathname}?${createPageQueryString(1)}`}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      // Show ellipsis if needed
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <span className="px-4 py-2">...</span>
          </PaginationItem>,
        )
      }
    }

    // Show pages around current page
    const startPage = Math.max(1, currentPage - 1)
    const endPage = Math.min(totalPages, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`${pathname}?${createPageQueryString(i)}`}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 3) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <span className="px-4 py-2">...</span>
        </PaginationItem>,
      )
    }

    // Show last page
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={`${pathname}?${createPageQueryString(totalPages)}`}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={currentPage <= 1}
            onClick={() => {
              if (currentPage > 1) {
                router.push(`${pathname}?${createPageQueryString(currentPage - 1)}`)
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
        </PaginationItem>

        {/* Page numbers */}
        {paginationItems()}

        {/* Next button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={currentPage >= totalPages}
            onClick={() => {
              if (currentPage < totalPages) {
                router.push(`${pathname}?${createPageQueryString(currentPage + 1)}`)
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
