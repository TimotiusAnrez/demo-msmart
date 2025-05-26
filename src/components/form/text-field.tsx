import React, { forwardRef } from 'react'
import { useFormContext, Controller, FieldValues, Path, FieldError } from 'react-hook-form'
import FormFieldWrapper from './form-field-wrapper'

interface TextFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  tooltip?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  defaultValue?: string
  className?: string
  wrapperClassName?: string
}

export const TextField = <T extends FieldValues>({
  name,
  label,
  tooltip,
  placeholder,
  required = false,
  disabled = false,
  type = 'text',
  defaultValue = '',
  className = '',
  wrapperClassName = '',
}: TextFieldProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()
  const error = errors[name] as FieldError | undefined

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as any}
      render={({ field }) => (
        <FormFieldWrapper
          name={name}
          label={label}
          tooltip={tooltip}
          error={error}
          required={required}
          disabled={disabled}
          className={wrapperClassName}
        >
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              px-3 py-2 border rounded-md
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            {...field}
          />
        </FormFieldWrapper>
      )}
    />
  )
}

export default TextField
