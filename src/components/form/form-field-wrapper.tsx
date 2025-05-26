import React from 'react'
import { FieldError } from 'react-hook-form'
import { Info } from 'lucide-react'

interface FormFieldWrapperProps {
  label?: string
  name: string
  tooltip?: string
  error?: FieldError
  required?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  name,
  tooltip,
  error,
  required = false,
  disabled = false,
  className = '',
  children,
}) => {
  return (
    <div className={`form-field ${disabled ? 'opacity-60' : ''} ${className}`}>
      {label && (
        <div className="flex items-center mb-1.5">
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {tooltip && (
            <div className="relative group ml-1.5">
              <Info size={16} className="text-gray-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 w-60 p-2 bg-black text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                {tooltip}
                <div className="absolute top-full left-0 w-3 h-3 -mt-1.5 ml-1.5 bg-black transform rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {children}

      {error && <p className="mt-1.5 text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

export default FormFieldWrapper
