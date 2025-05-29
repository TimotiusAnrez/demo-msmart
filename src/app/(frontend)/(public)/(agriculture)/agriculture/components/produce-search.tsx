'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface ProduceSearchProps {
  searchQuery?: string
}

export function ProduceSearch({ searchQuery = '' }: ProduceSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Reset to page 1 when searching
    params.set('page', '1')

    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim())
    } else {
      params.delete('search')
    }

    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams, searchTerm])

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Search produce..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      <Button type="button" onClick={handleSearch}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
