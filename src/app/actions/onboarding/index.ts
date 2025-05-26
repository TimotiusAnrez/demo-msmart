'use server'

import { createError, createSuccess } from '@/helper/serverActionResponse'
import {
  UserOnboardingFormData,
  userOnboardingSchema,
  type FormState,
} from '@/lib/schemas/user-schema'
import { ActionResult, ErrorSource } from '@/types/serverAction.types'

export async function submitOnboardingForm(data: UserOnboardingFormData): Promise<ActionResult> {
  // Validate form fields
  const validatedFields = userOnboardingSchema.safeParse({
    clerkID: data.clerkID,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    DOB: data.DOB,
    email: data.email,
    phone: data?.phone,
    documentType: data?.documentType,
    documentNumber: data?.documentNumber,
  })

  // If validation fails, return errors
  if (!validatedFields.success) {
    const error = {
      source: ErrorSource.VALIDATION,
      message: 'Input Format Error',
      code: 'Zod Error',
      details: validatedFields.error.flatten().fieldErrors,
    }

    return createError(error.source, error.message, error.code, error.details)
  }

  // Success case - in a real app, you'd save to database
  console.log('User onboarding data:', validatedFields.data)

  return createSuccess(validatedFields.data)
}
