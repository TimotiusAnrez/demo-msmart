'use server'

import { createError, createSuccess } from '@/helper/serverActionResponse'
import {
  UserOnboardingFormData,
  userOnboardingSchema,
  type FormState,
} from '@/lib/schemas/user-schema'
import { ActionResult, ErrorSource } from '@/types/serverAction.types'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ErrorMessage } from '@/types/errorType'
import { clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NavigationLink } from '@/types/globals.enum'

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

  const payload = await getPayload({ config })
  // create payload user
  try {
    //staging data

    const defaultRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] =
      ['USER']

    const input = {
      clerkID: data.clerkID,
      information: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        DOB: data.DOB,
      },
      role: defaultRole,
      contact: {
        email: {
          handler: data.email,
          isVerified: true,
        },
        phone: {
          number: data.phone ? data.phone : '0123456789',
          isVerified: false,
        },
      },
      verification: {
        documentNumber: data.documentNumber ? data.documentNumber : '',
        documentType: data.documentType ? data.documentType : 'IDCARD',
        status: 'UNVERIFIED' as 'UNVERIFIED',
      },
    }

    const user = await payload.create({
      collection: 'users',
      data: input,
    })

    if (!user) {
      throw new ErrorMessage('Fail to create user', ErrorSource.PAYLOAD, 500, {
        error: payload.logger.error,
      })
    }

    const cart = await payload.create({
      collection: 'cart',
      data: {
        user,
      },
    })

    if (!cart) {
      await payload.delete({
        collection: 'users',
        id: user.id,
      })
      throw new ErrorMessage('Fail to create cart for user', ErrorSource.PAYLOAD, 500, {
        error: payload.logger.error,
      })
    }

    const agriCart = await payload.create({
      collection: 'agriCart',
      data: {
        user,
      },
    })

    if (!agriCart) {
      await payload.delete({
        collection: 'users',
        id: user.id,
      })
      throw new ErrorMessage('Fail to create agri cart for user', ErrorSource.PAYLOAD, 500, {
        error: payload.logger.error,
      })
    }

    //update metadata

    const clerk = await clerkClient()
    const updatePublic = await clerk.users.updateUserMetadata(user.clerkID, {
      publicMetadata: {
        onboardingComplete: true,
        verificationStatus: 'UNVERIFIED',
        isSuspended: false,
      },
      privateMetadata: {
        payloadID: user.id,
        role: user.role,
        cartID: cart.id,
        agriCartID: agriCart.id,
      },
    })

    if (!updatePublic) {
      await payload.delete({
        collection: 'users',
        id: user.id,
      })

      throw new ErrorMessage('Fail to update user metadata', ErrorSource.PAYLOAD, 500, {
        error: payload.logger.error,
      })
    }

    return createSuccess(user)
  } catch (error) {
    if (error instanceof ErrorMessage) {
      return createError(error.code, error.message, error.message, error.details)
    }
  }

  return createError(ErrorSource.UNKNOWN, 'An unknown error occurred', 'An unknown error occurred')
}
