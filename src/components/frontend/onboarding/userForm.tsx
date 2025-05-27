'use client'

import React, { useEffect, useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField, SelectField, RadioGroupField } from '@/components/form/form-fields'
import { toast } from 'sonner'
import { UserOnboardingFormData, userOnboardingSchema } from '@/lib/schemas/user-schema'
import { submitOnboardingForm } from '@/app/actions/onboarding'
import { DateField } from '@/components/form/date-input-field'
import { redirect, useRouter } from 'next/navigation'
import { NavigationLink } from '@/types/globals.enum'
import { useFormStatus } from 'react-dom'
import Loading from '@/app/(frontend)/loading'
import TropicalLoading from '@/components/global/tropical-loading'

type FormValues = z.infer<typeof userOnboardingSchema>

interface UserOnboardingProps {
  clerkID: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
}

export default function UserOnboardingForm({
  clerkID,
  email,
  firstName,
  lastName,
}: UserOnboardingProps) {
  const [formStatus, setFormStatus] = useState<{ message: string; isError: boolean } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { pending } = useFormStatus()

  const defaultData: UserOnboardingFormData = {
    clerkID,
    email: email || '',
    firstName: firstName || '',
    lastName: lastName || '',
    gender: 'male',
    DOB: '',
    phone: '',
    documentType: 'IDCARD',
    documentNumber: '',
  }

  const methods = useForm<FormValues>({
    resolver: zodResolver(userOnboardingSchema),
    defaultValues: defaultData,
  })

  const router = useRouter()

  // Form submission handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsSubmitting(true)
      setFormStatus(null)

      // Submit form data using server action
      const result = await submitOnboardingForm(data)

      if (result.success) {
        toast.success(`Onboarding completed successfully`)

        setFormStatus({ message: 'User onboarding completed successfully', isError: false })
        redirect(NavigationLink.PROFILE)
      } else {
        setFormStatus({ message: result.error?.message || 'An error occurred', isError: true })
        toast.error(result.error?.message || 'An error occurred')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormStatus({
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        isError: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (formStatus?.message) {
      redirect(NavigationLink.PROFILE)
    }
  }, [formStatus])

  if (pending || isSubmitting) return <TropicalLoading />

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Form Example</h2>

      {/* {formStatus && (
        <div
          className={`p-4 mb-6 rounded ${formStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {formStatus.message}
        </div>
      )} */}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div className="flex w-full gap-x-4">
            <div className="container grow">
              <TextField<FormValues>
                name="firstName"
                label="First Name"
                tooltip="Enter your first name"
                required
                placeholder="John"
                disabled={isSubmitting || firstName ? true : false}
                className="w-full"
              />
            </div>

            <div className="container grow">
              <TextField<FormValues>
                name="lastName"
                label="Last Name"
                tooltip="Enter your last name"
                required
                placeholder="Doe"
                disabled={isSubmitting || lastName ? true : false}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-x-4">
            <div className="container grow">
              <SelectField<FormValues>
                name="gender"
                label="Gender"
                tooltip="Select your gender"
                required
                placeholder="Select your gender"
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            <div className="container grow">
              <DateField
                label="Date of Birth"
                required
                className="w-full"
                field={methods.register('DOB')}
                error={methods.formState.errors.DOB?.message}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-x-4">
            <div className="container grow">
              <TextField<FormValues>
                name="email"
                label="Email Address"
                tooltip="We'll use this email to contact you"
                required
                type="email"
                className="w-full"
                disabled={isSubmitting || email ? true : false}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="container grow">
              <TextField<FormValues>
                name="phone"
                label="Phone Number"
                tooltip="Optional phone number for contact"
                type="tel"
                className="w-full"
                disabled={isSubmitting}
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
          <div className="flex gap-x-4">
            <div className="container grow">
              <SelectField<FormValues>
                name="documentType"
                label="Document Type"
                tooltip="We'll use this email to contact you"
                className="w-full"
                placeholder="john.doe@example.com"
                options={[
                  { value: 'IDCARD', label: 'ID Card' },
                  { value: 'PASSPORT', label: 'Passport' },
                ]}
                disabled={isSubmitting}
                required={false}
              />
            </div>
            <div className="container grow">
              <TextField<FormValues>
                name="documentNumber"
                label="Document Number"
                tooltip="Optional phone number for contact"
                type="text"
                className="w-full"
                placeholder="1234567890"
                required={false}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                    w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
