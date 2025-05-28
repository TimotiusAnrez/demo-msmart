'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NewsCategory } from '@/payload-types'

interface NewsFilterProps {
  categories: NewsCategory[]
  activeCategory?: string
  searchQuery?: string
}

export function NewsFilter({ categories, activeCategory, searchQuery = '' }: NewsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(searchQuery)

  // Handle category selection
  const handleCategoryClick = (categoryId: string | null) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      // Remove page parameter to reset to page 1
      params.delete('page')

      if (categoryId === null) {
        // If "All" is selected, remove the category filter
        params.delete('category')
      } else {
        // Otherwise, set the category filter
        params.set('category', categoryId)
      }

      // Keep the search query if it exists
      if (searchValue) {
        params.set('query', searchValue)
      }

      router.push(`/news?${params.toString()}`)
    })
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      // Reset to page 1
      params.delete('page')

      // Update or remove search query
      if (searchValue.trim()) {
        params.set('query', searchValue)
      } else {
        params.delete('query')
      }

      router.push(`/news?${params.toString()}`)
    })
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!activeCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryClick(null)}
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id.toString() ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryClick(category.id.toString())}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
