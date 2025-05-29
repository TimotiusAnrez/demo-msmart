'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DiscussionCategory } from '@/payload-types'
import { toast } from 'sonner'
import { createDiscussion } from '@/app/api/discussions/actions'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  category: z.array(z.string()).min(1, 'Please select at least one category'),
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters')
    .max(2000, 'Content cannot exceed 2000 characters'),
})

type DiscussionFormValues = z.infer<typeof formSchema>

interface CreateDiscussionDialogProps {
  children: React.ReactNode
  categories: DiscussionCategory[]
}

export function CreateDiscussionDialog({ children, categories }: CreateDiscussionDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<DiscussionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: [],
      content: '',
    },
  })

  async function onSubmit(values: DiscussionFormValues) {
    setIsSubmitting(true)

    try {
      // Call the server action to create a new discussion
      const result = await createDiscussion({
        title: values.title,
        category: values.category,
        content: values.content,
      })

      if (result.success) {
        toast.success(result.message)

        // Close the dialog and reset the form
        setOpen(false)
        form.reset()

        // Refresh the discussions list
        router.refresh()

        // Redirect to the new discussion if created successfully
        if (result.data?.id) {
          router.push(`/discussion/${result.data.id}`)
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error creating discussion:', error)
      toast.error('Failed to create discussion')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts, questions, or ideas with the Labuan Bajo community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a descriptive title" {...field} />
                  </FormControl>
                  <FormDescription>Keep it concise and specific</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange([...field.value, value])}
                      value={
                        field.value.length > 0 ? field.value[field.value.length - 1] : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {field.value.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value.map((categoryId) => {
                          const category = categories.find((c) => c.id.toString() === categoryId)

                          return category ? (
                            <div
                              key={categoryId}
                              className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                              {category.name}
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(field.value.filter((id) => id !== categoryId))
                                }}
                                className="ml-2 rounded-full"
                              >
                                <span className="text-xs">×</span>
                                <span className="sr-only">Remove category</span>
                              </button>
                            </div>
                          ) : null
                        })}
                      </div>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share your thoughts here..." rows={8} {...field} />
                  </FormControl>
                  <FormDescription>
                    Be clear and respectful. Format your text for readability.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Discussion'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
