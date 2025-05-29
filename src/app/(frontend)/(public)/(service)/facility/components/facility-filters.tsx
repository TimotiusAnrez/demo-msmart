'use client'

import { useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FacilityFiltersProps {
  sectors: string[]
  activeSector?: string
  searchQuery: string
}

export function FacilityFilters({ sectors, activeSector, searchQuery }: FacilityFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(searchQuery)

  // Update the URL with new filters
  const updateFilters = useCallback(
    (newParams: { sector?: string; search?: string }) => {
      const params = new URLSearchParams()

      // Add search parameter if provided
      if (newParams.search) {
        params.set('search', newParams.search)
      }

      // Add sector parameter if provided
      if (newParams.sector) {
        params.set('sector', newParams.sector)
      }

      // Reset to page 1 when filters change
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname],
  )

  // Handle sector selection
  const handleSectorChange = (value: string) => {
    updateFilters({ sector: value, search })
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ sector: activeSector, search })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearch('')
    router.push(pathname)
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search facilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-14"
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Sector Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={activeSector} onValueChange={handleSectorChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {formatSector(sector)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {(activeSector || search) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(activeSector || search) && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {activeSector && (
            <div className="bg-primary/10 px-3 py-1 rounded-full text-primary flex items-center gap-1">
              <span>Sector: {formatSector(activeSector)}</span>
            </div>
          )}
          {search && (
            <div className="bg-primary/10 px-3 py-1 rounded-full text-primary flex items-center gap-1">
              <span>Search: {search}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper function to format sector text
function formatSector(sector: string): string {
  return sector
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
