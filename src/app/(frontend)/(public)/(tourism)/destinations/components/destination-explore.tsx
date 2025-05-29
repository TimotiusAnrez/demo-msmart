'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Location, LocationCategory, Media } from '@/payload-types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { DefaultAssets } from '@/types/globals.enum'

interface DestinationExploreProps {
  destinations: Location[]
  categories: LocationCategory[]
  totalPages: number
  currentPage: number
  totalDestinations: number
  selectedCategory: string
  searchQuery: string
}

export function DestinationExplore({
  destinations,
  categories,
  totalPages,
  currentPage,
  totalDestinations,
  selectedCategory,
  searchQuery,
}: DestinationExploreProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchQuery)

  // Create search parameters object that we can manipulate
  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    // Update the search params based on the provided params
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })

    return newSearchParams.toString()
  }

  // Handle category filter click
  const handleCategoryClick = (categoryId: string) => {
    const newCategoryId = selectedCategory === categoryId ? null : categoryId

    // Always reset to page 1 when changing filters
    router.push(
      `${pathname}?${createQueryString({
        category: newCategoryId,
        page: newCategoryId === null ? searchParams.get('page') : '1',
      })}`,
    )
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Navigate with the search parameter
    router.push(
      `${pathname}?${createQueryString({
        search: search.trim() ? search : null,
        page: '1', // Reset to page 1 on new search
      })}`,
    )
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    router.push(
      `${pathname}?${createQueryString({
        page: newPage.toString(),
      })}`,
    )
  }

  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5 // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Otherwise, show a sliding window around the current page
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, start + maxPagesToShow - 1)

      // Adjust the start if we're near the end
      if (end === totalPages) {
        start = Math.max(1, end - maxPagesToShow + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  return (
    <section className="py-16">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#174140]">Explore More</h2>
        <h2 className="text-3xl md:text-4xl font-bold text-[#174140] mt-1">Destinations</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar with search and filters */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Search box */}
          <Card className="p-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <h3 className="font-semibold text-lg">Search Destination</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>

          {/* Categories filter */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`w-full justify-start ${
                    selectedCategory === category.id.toString()
                      ? 'bg-[#26B0C2]/10 text-[#26B0C2] font-medium'
                      : 'text-gray-700'
                  }`}
                  onClick={() => handleCategoryClick(category.id.toString())}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* Help box */}
          <Card className="p-6 bg-[#174140] text-white">
            <h3 className="font-semibold text-xl mb-2">Need Help?</h3>
            <p className="text-sm text-gray-100 mb-4">
              Contact our travel experts for personalized recommendations and support.
            </p>
            <Button variant="outline" className="w-full text-white border-white hover:bg-white/20">
              Contact Us
            </Button>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {/* Results info and sorting */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{destinations.length}</span> of{' '}
              <span className="font-medium">{totalDestinations}</span> destinations
            </p>

            {/* Mobile filter button - for future implementation */}
            <Button variant="outline" className="lg:hidden">
              Filters
            </Button>
          </div>

          {/* Destinations grid */}
          {destinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => {
                // Get the first image from the media gallery, or use a placeholder

                let url: string = DefaultAssets.PRODUCT
                if (destination.MediaGallery && destination.MediaGallery[0].media) {
                  let baseMedia = destination.MediaGallery[0].media as Media
                  url = baseMedia.sizes?.tablet?.url || DefaultAssets.PRODUCT
                }

                // Get the category name if it's resolved
                const categoryName =
                  destination.category &&
                  destination.category.length > 0 &&
                  typeof destination.category[0] !== 'number'
                    ? destination.category[0].name
                    : 'Tourist Destination'

                return (
                  <Link href={`/destinations/${destination.id}`} key={destination.id}>
                    <Card className="overflow-hidden group cursor-pointer p-0 h-full">
                      {/* Image container with fixed aspect ratio */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={url}
                          alt={destination.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="px-4 pb-4 space-y-1">
                        <div className="flex items-center text-sm text-[#26B0C2]">
                          <h5>{categoryName}</h5>
                        </div>
                        <h3 className="font-semibold text-lg text-[#174140] group-hover:text-[#26B0C2] transition-colors">
                          {destination.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {destination.description ||
                            'Explore this beautiful destination in Labuan Bajo.'}
                        </p>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-500">No destinations found matching your criteria.</p>
              <Button variant="outline" onClick={() => router.push(pathname)} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    className={page === currentPage ? 'bg-[#26B0C2] hover:bg-[#26B0C2]/90' : ''}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
