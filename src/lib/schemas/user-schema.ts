import { z } from 'zod'

export const userOnboardingSchema = z.object({
  clerkID: z.string(),
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(50, { message: 'First name cannot exceed 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
    })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .max(50, { message: 'Last name cannot exceed 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
    })
    .trim(),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select your gender',
    invalid_type_error: 'Please select a valid gender option',
  }),
  DOB: z
    .string()
    .min(1, { message: 'Date of birth is required' })
    .refine(
      (date) => {
        const birthDate = new Date(date)
        return !isNaN(birthDate.getTime())
      },
      { message: 'Please enter a valid date' },
    )
    .refine(
      (date) => {
        const birthDate = new Date(date)
        const today = new Date()
        return birthDate <= today
      },
      { message: 'Date of birth cannot be in the future' },
    )
    .refine(
      (date) => {
        const birthDate = new Date(date)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        const dayDiff = today.getDate() - birthDate.getDate()

        let actualAge = age
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          actualAge--
        }

        return actualAge >= 13
      },
      { message: 'You must be at least 13 years old to register' },
    )
    .refine(
      (date) => {
        const birthDate = new Date(date)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        return age <= 120
      },
      { message: 'Please enter a valid date of birth' },
    ),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address (e.g., user@example.com)' })
    .max(254, { message: 'Email address is too long' })
    .trim()
    .refine(
      (email) => {
        // Check for common email format issues
        const hasValidDomain = email.includes('.') && !email.endsWith('.')
        return hasValidDomain
      },
      { message: 'Email must include a valid domain (e.g., @gmail.com)' },
    ),
  phone: z
    .string()
    .optional()
    .nullable()
    .or(
      z
        .string()
        .min(1, { message: 'Phone number is required' })
        .min(10, { message: 'Phone number must be at least 10 digits' })
        .max(15, { message: 'Phone number cannot exceed 15 digits' })
        .regex(/^\+?[\d\s\-().]+$/, {
          message:
            'Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign',
        })
        .trim()
        .refine(
          (phone) => {
            // Remove all non-digit characters to count actual digits
            const digitsOnly = phone.replace(/\D/g, '')
            return digitsOnly.length >= 10
          },
          { message: 'Phone number must contain at least 10 digits' },
        )
        .refine(
          (phone) => {
            // Check for obviously invalid patterns
            const digitsOnly = phone.replace(/\D/g, '')
            return !/^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/.test(digitsOnly)
          },
          { message: 'Please enter a valid phone number' },
        ),
    ),

  documentType: z
    .enum(['PASSPORT', 'IDCARD'], {
      required_error: 'Please select a document type',
      invalid_type_error: 'Please select a valid document type',
    })
    .optional()
    .nullable(),
  documentNumber: z
    .string()
    .optional()
    .nullable()
    .or(
      z
        .string()
        .min(1, { message: 'Document number is required' })
        .min(5, { message: 'Document number must be at least 5 characters long' })
        .max(20, { message: 'Document number cannot exceed 20 characters' })
        .regex(/^[A-Z0-9\-\s]+$/i, {
          message: 'Document number can only contain letters, numbers, hyphens, and spaces',
        })
        .trim()
        .refine(
          (docNum) => {
            // Remove spaces and hyphens to check for actual content
            const cleanDocNum = docNum.replace(/[\s-]/g, '')
            return cleanDocNum.length >= 5
          },
          { message: 'Document number must contain at least 5 valid characters' },
        ),
    ),
})

export type UserOnboardingFormData = z.infer<typeof userOnboardingSchema>

export type FormState =
  | {
      success?: boolean
      message?: string
      errors?: {
        firstName?: string[]
        lastName?: string[]
        gender?: string[]
        DOB?: string[]
        email?: string[]
        phone?: string[]
        documentType?: string[]
        documentNumber?: string[]
      }
    }
  | undefined
