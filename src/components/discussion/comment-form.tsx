'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import TextField from '@/components/form/text-field'
import { toast } from 'sonner'

// Define Zod schema for comment validation
const commentSchema = z.object({
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters long')
    .max(1000, 'Comment cannot exceed 1000 characters'),
})

type CommentFormValues = z.infer<typeof commentSchema>

interface CommentFormProps {
  discussionId: number
}

export function CommentForm({ discussionId }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize React Hook Form with Zod validation
  const methods = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true)

    try {
      // In a real implementation, this would send a request to add a comment
      // For this example, we just show a toast notification

      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success('Comment added successfully')

      // Reset the form after successful submission
      methods.reset()
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="text-base font-medium mb-3">Add Your Comment</h3>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {/* Comment Text Field */}
          <TextField<CommentFormValues>
            name="content"
            placeholder="Share your thoughts..."
            required
            type="text"
            wrapperClassName="w-full"
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
