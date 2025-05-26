import React from 'react'
import { useFormContext, Controller, FieldValues, Path, FieldError } from 'react-hook-form'
import FormFieldWrapper from './form-field-wrapper'
import { Info, Check } from 'lucide-react'

// Re-export the TextField component
export { default as TextField } from './text-field'

// SelectField Component
interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  tooltip?: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: string
  className?: string
  wrapperClassName?: string
}

export const SelectField = <T extends FieldValues>({
  name,
  label,
  tooltip,
  options,
  placeholder,
  required = false,
  disabled = false,
  defaultValue = '',
  className = '',
  wrapperClassName = '',
}: SelectFieldProps<T>) => {
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
          <select
            id={name}
            disabled={disabled}
            className={`
              w-full px-3 py-2 border rounded-md bg-white
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            {...field}
            value={field.value || ''}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormFieldWrapper>
      )}
    />
  )
}

// TextAreaField Component
interface TextAreaFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  tooltip?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  defaultValue?: string
  className?: string
  wrapperClassName?: string
}

export const TextAreaField = <T extends FieldValues>({
  name,
  label,
  tooltip,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  defaultValue = '',
  className = '',
  wrapperClassName = '',
}: TextAreaFieldProps<T>) => {
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
          <textarea
            id={name}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-3 py-2 border rounded-md resize-vertical
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

// CheckboxField Component
interface CheckboxFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  tooltip?: string
  disabled?: boolean
  defaultChecked?: boolean
  className?: string
  wrapperClassName?: string
}

export const CheckboxField = <T extends FieldValues>({
  name,
  label,
  tooltip,
  disabled = false,
  defaultChecked = false,
  className = '',
  wrapperClassName = '',
}: CheckboxFieldProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()
  const error = errors[name] as FieldError | undefined

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultChecked as any}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className={`flex items-start ${wrapperClassName}`}>
          <div className="flex items-center h-5">
            <input
              id={name}
              type="checkbox"
              checked={!!value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              className={`
                w-4 h-4 border rounded
                ${error ? 'border-red-500' : 'border-gray-300'}
                focus:ring-blue-500 focus:ring-2 focus:ring-offset-0
                disabled:bg-gray-100 disabled:cursor-not-allowed
                ${className}
              `}
              ref={ref}
            />
          </div>
          <div className="ml-3 text-sm">
            {label && (
              <label htmlFor={name} className="font-medium text-gray-700">
                {label}
              </label>
            )}
            {tooltip && (
              <div className="relative inline-block group ml-1.5">
                <Info size={16} className="text-gray-400 cursor-help inline" />
                <div className="absolute left-0 bottom-full mb-2 w-60 p-2 bg-black text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                  {tooltip}
                  <div className="absolute top-full left-0 w-3 h-3 -mt-1.5 ml-1.5 bg-black transform rotate-45"></div>
                </div>
              </div>
            )}
            {error && <p className="text-red-500 mt-1">{error.message}</p>}
          </div>
        </div>
      )}
    />
  )
}

// RadioGroupField Component
interface RadioOption {
  value: string
  label: string
}

interface RadioGroupFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  tooltip?: string
  options: RadioOption[]
  required?: boolean
  disabled?: boolean
  defaultValue?: string
  className?: string
  wrapperClassName?: string
}

export const RadioGroupField = <T extends FieldValues>({
  name,
  label,
  tooltip,
  options,
  required = false,
  disabled = false,
  defaultValue = '',
  className = '',
  wrapperClassName = '',
}: RadioGroupFieldProps<T>) => {
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
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <FormFieldWrapper
          name={name}
          label={label}
          tooltip={tooltip}
          error={error}
          required={required}
          disabled={disabled}
          className={wrapperClassName}
        >
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${name}-${option.value}`}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  onBlur={onBlur}
                  disabled={disabled}
                  className={`
                    w-4 h-4 border
                    ${error ? 'border-red-500' : 'border-gray-300'}
                    text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${className}
                  `}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </FormFieldWrapper>
      )}
    />
  )
}

// SwitchField Component
interface SwitchFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  tooltip?: string
  disabled?: boolean
  defaultChecked?: boolean
  className?: string
  wrapperClassName?: string
}

export const SwitchField = <T extends FieldValues>({
  name,
  label,
  tooltip,
  disabled = false,
  defaultChecked = false,
  className = '',
  wrapperClassName = '',
}: SwitchFieldProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()
  const error = errors[name] as FieldError | undefined

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultChecked as any}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className={`flex items-center justify-between ${wrapperClassName}`}>
          <div className="flex items-center">
            {label && <span className="text-sm font-medium text-gray-700 mr-2">{label}</span>}
            {tooltip && (
              <div className="relative inline-block group">
                <Info size={16} className="text-gray-400 cursor-help inline" />
                <div className="absolute left-0 bottom-full mb-2 w-60 p-2 bg-black text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                  {tooltip}
                  <div className="absolute top-full left-0 w-3 h-3 -mt-1.5 ml-1.5 bg-black transform rotate-45"></div>
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => onChange(!value)}
              onBlur={onBlur}
              disabled={disabled}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                ${value ? 'bg-blue-600' : 'bg-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                transition-colors ease-in-out duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${className}
              `}
              ref={ref}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white shadow
                  ${value ? 'translate-x-5' : 'translate-x-1'}
                  transition ease-in-out duration-200
                `}
              />
            </button>
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
          </div>
        </div>
      )}
    />
  )
}
