'use client'

import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, ImageIcon, AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export interface FileWithPreview extends File {
  preview: string
}

export interface ImageUploadProps {
  value?: FileWithPreview | FileWithPreview[]
  onChange?: (files: FileWithPreview | FileWithPreview[] | undefined) => void
  onBlur?: () => void
  disabled?: boolean
  mode?: 'dropzone' | 'input'
  multiple?: boolean
  maxSize?: number // in bytes
  accept?: string
  className?: string
  label?: string
  error?: string
  placeholder?: string
  maxFiles?: number
}

export function ImageUpload({
  value,
  onChange,
  onBlur,
  disabled = false,
  mode = 'dropzone',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = 'image/*',
  className,
  label,
  error,
  placeholder = 'Upload image',
  maxFiles = 5,
}: ImageUploadProps) {
  const [files, setFiles] = React.useState<FileWithPreview[]>(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  })

  // Update internal files state when value prop changes
  React.useEffect(() => {
    if (!value) {
      setFiles([])
      return
    }

    const newFiles = Array.isArray(value) ? value : [value]
    setFiles(newFiles)
  }, [value])

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  const handleFilesAdded = React.useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return

      // Create preview URLs
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ) as FileWithPreview[]

      // Update state based on multiple flag
      const updatedFiles = multiple
        ? [...files, ...newFiles].slice(0, maxFiles)
        : newFiles.slice(0, 1)
      setFiles(updatedFiles)

      // Call onChange with the new files
      if (onChange) {
        onChange(multiple ? updatedFiles : updatedFiles[0])
      }

      // Call onBlur if provided
      if (onBlur) {
        onBlur()
      }
    },
    [disabled, files, multiple, onChange, onBlur, maxFiles],
  )

  const handleRemoveFile = React.useCallback(
    (fileToRemove: FileWithPreview) => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(fileToRemove.preview)

      // Remove the file from state
      const updatedFiles = files.filter((file) => file !== fileToRemove)
      setFiles(updatedFiles)

      // Call onChange with the updated files
      if (onChange) {
        onChange(multiple ? updatedFiles : updatedFiles[0])
      }

      // Call onBlur if provided
      if (onBlur) {
        onBlur()
      }
    },
    [files, multiple, onChange, onBlur],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: { [accept]: [] },
    maxSize,
    multiple,
    disabled,
    maxFiles,
    onDrop: handleFilesAdded,
  })

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const fileList = Array.from(e.target.files)
    handleFilesAdded(fileList)
  }

  // Get rejection errors
  const rejectionErrors = fileRejections
    .map(({ errors }) => {
      return errors.map((error) => {
        if (error.code === 'file-too-large') {
          return `File is too large. Max size is ${maxSize / (1024 * 1024)}MB.`
        }
        if (error.code === 'file-invalid-type') {
          return 'Invalid file type. Please upload an image.'
        }
        if (error.code === 'too-many-files') {
          return `Too many files. Max ${maxFiles} files allowed.`
        }
        return error.message
      })
    })
    .flat()

  return (
    <div className={cn('grid w-full gap-1.5', className)}>
      {label && <Label className={cn(error && 'text-destructive')}>{label}</Label>}

      {mode === 'dropzone' ? (
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
            error && 'border-destructive',
            disabled && 'opacity-50 cursor-not-allowed',
            'hover:border-primary/50',
          )}
        >
          {/* Show either preview or dropzone */}
          {files.length > 0 ? (
            <div className="grid gap-4 w-full">
              <div
                className={cn(
                  'grid gap-4',
                  multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1',
                )}
              >
                {files.map((file) => (
                  <div
                    key={file.name + file.size}
                    className="relative group rounded-md overflow-hidden border border-muted"
                  >
                    <div className="image-preview w-full flex justify-center">
                      <div className="aspect-square w-1/2 relative">
                        <img
                          src={file.preview || '/placeholder.svg'}
                          alt={file.name}
                          className="object-cover w-full h-full"
                          onLoad={() => {
                            // Revoke the data uri after the image is loaded to save memory
                            // URL.revokeObjectURL(file.preview)
                          }}
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile(file)
                        }}
                        disabled={disabled}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs truncate p-1">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Drop files here' : placeholder}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {multiple
                      ? `Drag & drop up to ${maxFiles} images or click to select`
                      : 'Drag & drop an image or click to select'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max size: {maxSize / (1024 * 1024)}MB
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleInputChange}
            className={cn(error && 'border-destructive')}
          />
          <p className="text-xs text-muted-foreground">
            {multiple
              ? `Select up to ${maxFiles} images. Max size: ${maxSize / (1024 * 1024)}MB each.`
              : `Select an image. Max size: ${maxSize / (1024 * 1024)}MB.`}
          </p>
        </div>
      )}

      {/* Error messages */}
      {(error || rejectionErrors.length > 0) && (
        <div className="flex items-center text-destructive text-sm mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          <p>{error || rejectionErrors[0]}</p>
        </div>
      )}
    </div>
  )
}
