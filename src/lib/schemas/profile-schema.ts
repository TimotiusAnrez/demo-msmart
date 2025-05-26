import { z } from 'zod'

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
  }),
  DOB: z.string().min(1, 'Date of birth is required'),
  documentType: z
    .enum(['PASSPORT', 'IDCARD'], {
      required_error: 'Please select a document type',
    })
    .optional()
    .nullable(),
  documentNumber: z
    .string()
    .min(1, 'Document number is required')
    .max(20, 'Document number must be less than 20 characters')
    .optional()
    .nullable(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().nullable(),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>
