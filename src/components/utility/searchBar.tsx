// components/search-bar.tsx
'use client'

import { useCallback, useState, useTransition } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Search, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  /** Placeholder text for the search input */
  placeholder?: string
  /** Search parameter name in URL (default: 'query') */
  paramName?: string
  /** Debounce delay in milliseconds (default: 300) */
  debounceDelay?: number
  /** Whether to reset page parameter when searching */
  resetPage?: boolean
  /** Additional className for the container */
  className?: string
  /** Callback function when search value changes */
  onSearch?: (value: string) => void
  /** Whether to show clear button */
  showClearButton?: boolean
  /** Whether to show search icon */
  showSearchIcon?: boolean
}

export function SearchBar({
  placeholder = 'Search...',
  paramName = 'query',
  debounceDelay = 300,
  resetPage = true,
  className,
  onSearch,
  showClearButton = true,
  showSearchIcon = true,
}: SearchBarProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDebouncing, setIsDebouncing] = useState(false)

  // Get the current search value from URL
  const currentValue = searchParams.get(paramName) || ''

  // Handle search with debouncing
  const handleSearch = useDebouncedCallback((term: string) => {
    setIsDebouncing(false)

    startTransition(() => {
      const params = new URLSearchParams(searchParams)

      if (term) {
        params.set(paramName, term)
      } else {
        params.delete(paramName)
      }

      // Reset page to 1 when searching
      if (resetPage && params.has('page')) {
        params.set('page', '1')
      }

      // Update URL
      replace(`${pathname}?${params.toString()}`)

      // Call optional callback
      onSearch?.(term)
    })
  }, debounceDelay)

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setIsDebouncing(true)
      handleSearch(value)
    },
    [handleSearch],
  )

  // Handle clear search
  const handleClear = useCallback(() => {
    setIsDebouncing(false)

    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.delete(paramName)

      if (resetPage && params.has('page')) {
        params.set('page', '1')
      }

      replace(`${pathname}?${params.toString()}`)
      onSearch?.('')
    })
  }, [searchParams, paramName, resetPage, pathname, replace, onSearch])

  const isLoading = isPending || isDebouncing

  return (
    <div className={cn('relative', className)}>
      {/* Search Icon */}
      {showSearchIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      )}

      {/* Input Field */}
      <Input
        type="text"
        placeholder={placeholder}
        onChange={handleInputChange}
        defaultValue={currentValue}
        className={cn(showSearchIcon && 'pl-9', showClearButton && currentValue && 'pr-9')}
        aria-label="Search"
      />

      {/* Clear Button */}
      {showClearButton && currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
