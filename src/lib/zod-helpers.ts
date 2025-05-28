import { z } from 'zod'

// Maximum file size (5MB by default)
export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024

// Common image types
export const COMMON_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

/**
 * Creates a Zod schema for validating image files
 * @param maxSize Maximum file size in bytes (default: 5MB)
 * @param acceptedTypes Array of accepted MIME types (default: common image types)
 * @param required Whether the file is required (default: false)
 * @returns Zod schema for image validation
 */
export function createImageSchema(
  maxSize = DEFAULT_MAX_FILE_SIZE,
  acceptedTypes = COMMON_IMAGE_TYPES,
  required = false,
) {
  let schema = z
    .instanceof(File)
    .refine((file) => file.size <= maxSize, `Max file size is ${maxSize / (1024 * 1024)}MB.`)
    .refine(
      (file) => acceptedTypes.includes(file.type),
      `Only ${acceptedTypes.map((type) => type.split('/')[1]).join(', ')} formats are supported.`,
    )

  if (!required) {
    schema = schema.optional()
  }

  return schema
}

/**
 * Creates a Zod schema for validating multiple image files
 * @param maxSize Maximum file size in bytes (default: 5MB)
 * @param acceptedTypes Array of accepted MIME types (default: common image types)
 * @param minFiles Minimum number of files required (default: 1)
 * @param maxFiles Maximum number of files allowed (default: 5)
 * @returns Zod schema for multiple images validation
 */
export function createMultipleImagesSchema(
  maxSize = DEFAULT_MAX_FILE_SIZE,
  acceptedTypes = COMMON_IMAGE_TYPES,
  minFiles = 1,
  maxFiles = 5,
) {
  return z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= maxSize, `Max file size is ${maxSize / (1024 * 1024)}MB.`)
        .refine(
          (file) => acceptedTypes.includes(file.type),
          `Only ${acceptedTypes.map((type) => type.split('/')[1]).join(', ')} formats are supported.`,
        ),
    )
    .min(minFiles, `At least ${minFiles} image${minFiles > 1 ? 's are' : ' is'} required`)
    .max(maxFiles, `Maximum ${maxFiles} images allowed`)
}
