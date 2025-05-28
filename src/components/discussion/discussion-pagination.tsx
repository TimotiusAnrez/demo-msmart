'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DiscussionPaginationProps {
  currentPage: number
  totalPages: number
}

export function DiscussionPagination({ currentPage, totalPages }: DiscussionPaginationProps) {
  const searchParams = useSearchParams()

  function createPageURL(pageNumber: number | string): string {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `?${params.toString()}`
  }

  // If there's only 1 page or less, don't render pagination
  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers to display (show current page, 2 before and 2 after when possible)
  const pageNumbers = generatePaginationNumbers(currentPage, totalPages)

  return (
    <nav className="mx-auto flex w-full justify-center">
      <ul className="flex items-center gap-1">
        {/* Previous Page Button */}
        <li>
          <PaginationLink href={createPageURL(currentPage - 1)} disabled={currentPage <= 1}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </PaginationLink>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((page, i) => {
          if (page === '...') {
            return (
              <li key={`ellipsis-${i}`}>
                <div className="flex h-9 w-9 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              </li>
            )
          }

          return (
            <li key={`page-${page}`}>
              <PaginationLink href={createPageURL(page)} isActive={currentPage === page}>
                {page}
              </PaginationLink>
            </li>
          )
        })}

        {/* Next Page Button */}
        <li>
          <PaginationLink
            href={createPageURL(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </PaginationLink>
        </li>
      </ul>
    </nav>
  )
}

interface PaginationLinkProps extends React.ComponentPropsWithoutRef<typeof Button> {
  href: string
  isActive?: boolean
  disabled?: boolean
}

function PaginationLink({ href, isActive, disabled, ...props }: PaginationLinkProps) {
  if (disabled) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 cursor-not-allowed opacity-50"
        disabled
        {...props}
      />
    )
  }

  if (isActive) {
    return <Button variant="default" size="icon" className="h-9 w-9" {...props} />
  }

  return (
    <Button variant="outline" size="icon" className="h-9 w-9" asChild {...props}>
      <Link href={href} />
    </Button>
  )
}

function generatePaginationNumbers(currentPage: number, totalPages: number) {
  // If 7 or fewer pages, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Always show first and last page
  // Show ellipsis when needed and current page with neighbors
  const pages: Array<number | string> = []

  // First page
  pages.push(1)

  // Show ellipsis if current page is more than 3
  if (currentPage > 3) {
    pages.push('...')
  }

  // Show pages around current page
  let start = Math.max(2, currentPage - 1)
  let end = Math.min(totalPages - 1, currentPage + 1)

  // Ensure we always show at least 3 pages in the middle section
  if (end - start + 1 < 3) {
    if (currentPage < totalPages / 2) {
      end = Math.min(totalPages - 1, start + 2)
    } else {
      start = Math.max(2, end - 2)
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Show ellipsis if current page is less than totalPages - 2
  if (currentPage < totalPages - 2) {
    pages.push('...')
  }

  // Last page
  pages.push(totalPages)

  return pages
}
