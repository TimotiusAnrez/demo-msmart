'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DiscussionCategory } from '@/payload-types'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
})

type SearchFormValues = z.infer<typeof formSchema>

interface DiscussionSearchProps {
  categories: DiscussionCategory[]
}

export function DiscussionSearch({ categories }: DiscussionSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  // Initialize form with URL search params
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: searchParams.get('query') || '',
      category: searchParams.get('category') || '',
    },
  })

  // Set mounted state after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  function onSubmit(values: SearchFormValues) {
    const params = new URLSearchParams(searchParams.toString())

    // Update search params based on form values
    if (values.query) {
      params.set('query', values.query)
    } else {
      params.delete('query')
    }

    if (values.category) {
      params.set('category', values.category)
    } else {
      params.delete('category')
    }

    // Reset to page 1 when search criteria changes
    params.set('page', '1')

    // Update URL with new search params
    router.push(`?${params.toString()}`)
  }

  function handleReset() {
    form.reset({ query: '', category: '' })
    router.push('/discussion')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4"
        >
          {/* Search Query */}
          <div className="flex-1">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search discussions..." className="pl-8" {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-[200px]">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
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
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
