'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface ValueProps {
  options: { id: number; name: string }[]
  label: string
  paramKey: string
}

export function CheckBoxFilter({ options, label, paramKey }: ValueProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)

  // Get selected values from URL params
  const selectedValues = useMemo(() => {
    const param = searchParams.get(paramKey)
    return param ? param.split(',').map(Number) : []
  }, [searchParams, paramKey])

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    return options.filter((option) => option.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [options, searchQuery])

  // Update URL search params
  const updateSearchParams = (newSelectedValues: number[]) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newSelectedValues.length > 0) {
      params.set(paramKey, newSelectedValues.join(','))
    } else {
      params.delete(paramKey)
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Handle checkbox toggle
  const handleCheckboxChange = (optionId: number, checked: boolean) => {
    const newSelectedValues = checked
      ? [...selectedValues, optionId]
      : selectedValues.filter((id) => id !== optionId)

    updateSearchParams(newSelectedValues)
  }

  // Reset all filters
  const handleReset = () => {
    updateSearchParams([])
    setIsDialogOpen(false)
  }

  // Apply filters and close dialog
  const handleApply = () => {
    setIsDialogOpen(false)
  }

  // Show limited options (first 4)
  const limitedOptions = options.slice(0, 4)
  const hasMoreOptions = options.length > 4

  return (
    <div className="space-y-4">
      <Collapsible>
        <CollapsibleTrigger
          className="flex items-center gap-x-10"
          onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
        >
          <h3 className="font-semibold md:text-lg text-md">{label}</h3>
          <ChevronUp
            className={cn('h-6 w-6 transition-transform', isCollapsibleOpen ? 'rotate-180' : '')}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4">
          {options.length > 4 ? (
            <div className="space-y-4">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${paramKey}-${option.id}`}
                    checked={selectedValues.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`${paramKey}-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.name}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {limitedOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${paramKey}-${option.id}`}
                    checked={selectedValues.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`${paramKey}-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.name}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Show All button */}
          {hasMoreOptions && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-sm underline">
                  Show all
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle>{label}</DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogHeader>

                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Options grid */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-4 py-4">
                    {filteredOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dialog-${paramKey}-${option.id}`}
                          checked={selectedValues.includes(option.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(option.id, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`dialog-${paramKey}-${option.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dialog actions */}
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button onClick={handleApply} className="bg-black text-white hover:bg-gray-800">
                    Apply
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
