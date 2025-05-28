'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface ProductSearchProps {
  defaultValue?: string
}

export function ProductSearch({ defaultValue = '' }: ProductSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(defaultValue)

  // Create a new URLSearchParams instance to manipulate params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      // Reset to page 1 when searching
      params.set('page', '1')

      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      return params.toString()
    },
    [searchParams],
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`${pathname}?${createQueryString('search', searchQuery)}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative flex-1">
      <Input
        type="text"
        placeholder="Search products..."
        className="h-10 pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-10 w-10"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}
