'use client'

import { Input } from '@/components/ui/input'
import { FormFieldWrapper } from './form-field-wrapper'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { AlertCircle, CheckCircle, Calendar } from 'lucide-react'

interface DateFieldProps {
  label: string
  required?: boolean
  className?: string
  field: any
  error?: string
}

export function DateField({ label, required = false, className, field, error }: DateFieldProps) {
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const hasError = error && hasInteracted
  const hasValue = field.value && field.value.length > 0
  const isValid = hasInteracted && hasValue && !error

  return (
    <FormFieldWrapper label={label} name={field.name} required={required} className={className}>
      <div className="relative">
        <Input
          type="date"
          {...field}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false)
            setHasInteracted(true)
            field.onBlur(e)
          }}
          onChange={(e) => {
            field.onChange(e)
            if (!hasInteracted) setHasInteracted(true)
          }}
          className={cn(
            'transition-all duration-200 pr-10',
            hasError && 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-200',
            isValid &&
              'border-green-300 bg-green-50/50 focus:border-green-500 focus:ring-green-200',
            !hasError && !isValid && hasInteracted && 'ring-1 ring-blue-200 border-blue-300',
            !hasError && !isValid && hasValue && 'bg-blue-50/50',
            isFocused && !hasError && 'ring-2 ring-blue-200 border-blue-400',
          )}
        />

        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}
          {isValid && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </div>

      {/* Enhanced Error Message */}
      {hasError && (
        <div className="flex items-start gap-2 mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </FormFieldWrapper>
  )
}
