'use client'

import React, { useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  TextField,
  SelectField,
  TextAreaField,
  CheckboxField,
  RadioGroupField,
  SwitchField,
} from './form-fields'
import { toast } from 'sonner'

// Define our form schema with Zod
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be less than 50 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .optional()
    .or(z.literal('')),
  role: z.string({ required_error: 'Please select a role' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(500, { message: 'Message must be less than 500 characters long' }),
  agreeToTerms: z.boolean(),
  notifications: z.boolean().optional(),
  contactPreference: z.enum(['email', 'phone', 'both'], {
    required_error: 'Please select a contact preference',
  }),
})

// Create a type from the schema
type FormValues = z.infer<typeof formSchema>

// This would typically be in a separate file
async function submitFormAction(data: FormValues) {
  // In a real app, you would save to a database, call an API, etc.
  toast.success(JSON.stringify(data))

  // Return a success/error message
  return { success: true, message: 'Form submitted successfully!' }
}

export default function FormExample() {
  const [formStatus, setFormStatus] = useState<{ message: string; isError: boolean } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with react-hook-form and zod resolver
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      message: '',
      agreeToTerms: false,
      notifications: false,
      contactPreference: 'email',
    },
  })

  // Form submission handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsSubmitting(true)
      setFormStatus(null)

      // Submit form data using server action
      const result = await submitFormAction(data)

      if (result.success) {
        setFormStatus({ message: result.message, isError: false })
        methods.reset() // Reset form on success
      } else {
        setFormStatus({ message: result.message || 'An error occurred', isError: true })
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Form Example</h2>

      {formStatus && (
        <div
          className={`p-4 mb-6 rounded ${formStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {formStatus.message}
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <TextField<FormValues>
            name="name"
            label="Full Name"
            tooltip="Enter your full legal name"
            required
            placeholder="John Doe"
          />

          {/* Email Field */}
          <TextField<FormValues>
            name="email"
            label="Email Address"
            tooltip="We'll use this email to contact you"
            required
            type="email"
            placeholder="john.doe@example.com"
          />

          {/* Phone Field */}
          <TextField<FormValues>
            name="phone"
            label="Phone Number"
            tooltip="Optional phone number for contact"
            type="tel"
            placeholder="(123) 456-7890"
          />

          {/* Role Select Field */}
          <SelectField<FormValues>
            name="role"
            label="Role"
            tooltip="Select the role that best describes you"
            required
            placeholder="Select a role"
            options={[
              { value: 'developer', label: 'Developer' },
              { value: 'designer', label: 'Designer' },
              { value: 'manager', label: 'Project Manager' },
              { value: 'other', label: 'Other' },
            ]}
          />

          {/* Message Text Area */}
          <TextAreaField<FormValues>
            name="message"
            label="Message"
            tooltip="Tell us how we can help you"
            required
            placeholder="Please describe your inquiry..."
            rows={5}
          />

          {/* Contact Preference Radio Group */}
          <RadioGroupField<FormValues>
            name="contactPreference"
            label="Preferred Contact Method"
            tooltip="How would you like us to contact you?"
            required
            options={[
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'both', label: 'Both' },
            ]}
          />

          {/* Notifications Switch */}
          <SwitchField<FormValues>
            name="notifications"
            label="Receive Notifications"
            tooltip="Toggle to receive updates about our services"
          />

          {/* Terms and Conditions Checkbox */}
          <CheckboxField<FormValues>
            name="agreeToTerms"
            label="I agree to the Terms and Conditions"
            tooltip="You must agree to our terms of service to submit this form"
          />

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
