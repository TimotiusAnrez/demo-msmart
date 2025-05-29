'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ProduceCategory } from '@/payload-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCallback } from 'react'

interface ProduceFilterProps {
  categories: ProduceCategory[]
  selectedCategory?: string
}

export function ProduceFilter({ categories, selectedCategory }: ProduceFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Create a new URLSearchParams instance to manipulate params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      // Reset to page 1 when changing filters
      params.set('page', '1')

      if (value && value !== 'all') {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      return params.toString()
    },
    [searchParams],
  )

  return (
    <div className="w-full sm:w-[200px]">
      <Select
        defaultValue={selectedCategory || ''}
        onValueChange={(value) => {
          // Update URL params to filter by category
          router.push(`${pathname}?${createQueryString('category', value)}`)
        }}
      >
        <SelectTrigger className="h-10">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
