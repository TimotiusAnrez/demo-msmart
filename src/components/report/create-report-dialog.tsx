'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuth } from '@clerk/nextjs'
import * as z from 'zod'
import { Loader2, Upload } from 'lucide-react'

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
import { ReportCategory } from '@/payload-types'
import { NavigationLink } from '@/types/globals.enum'
import { FileWithPreview, ImageUpload } from '@/components/ui/image-upload'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { createReport } from '@/app/api/reports/actions'

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  content: z
    .string()
    .min(20, { message: 'Report content must be at least 20 characters' })
    .max(2000, { message: 'Report content must be less than 2000 characters' }),
  category: z.string({ required_error: 'Please select at least one category' }),
  media: z.string({ required_error: 'Please upload an image for your report' }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateReportDialogProps {
  children: React.ReactNode
  categories: ReportCategory[]
}

export function CreateReportDialog({ children, categories }: CreateReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [singleImage, setSingleImage] = useState<FileWithPreview>()
  const router = useRouter()
  const { userId } = useAuth()
  const [uploadMode, setUploadMode] = useState<'dropzone' | 'input'>('dropzone')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      media: '',
    },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(data: FormValues) {
    if (!userId) {
      toast.error('You must be logged in to create a report')
      router.push(NavigationLink.SIGN_IN)
      return
    }

    try {
      setUploading(true)

      // Handle file upload if an image was selected
      let mediaId: number | undefined

      if (singleImage) {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('file', singleImage)
        formData.append('alt', `Image for report: ${data.title}`)

        // Upload the file first
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadResult = await uploadResponse.json()

        if (!uploadResult.success) {
          throw new Error(uploadResult.message || 'Failed to upload image')
        }

        // Get the media ID from the upload result
        mediaId = uploadResult.media.id
      }
      // Add this right after getting the mediaId
      // Ensure mediaId is available before proceeding
      if (!mediaId) {
        toast.error('An image is required for this report')
        return
      }

      // Call the server action to create the report
      const result = await createReport({
        title: data.title,
        content: data.content,
        categoryId: data.category,
        mediaId,
      })

      if (!result.success) {
        throw new Error(result.message)
      }

      // Close dialog and reset form
      setOpen(false)
      form.reset()
      setSingleImage(undefined)

      // Show success message
      toast.success(result.message)

      // Navigate to the new report
      if (result.data?.id) {
        router.push(`${NavigationLink.REPORT}/${result.data.id}`)
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating report:', error)
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  const isMobile = useIsMobile()

  const handleFileUpload = (url: string, id: string) => {
    setSingleImage({
      preview: url,
    } as FileWithPreview)
    form.setValue('media', id)
    setUploading(false)
  }

  const formContent = (
    <div className="space-y-6 py-2 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Image (Optional)</FormLabel>
                <FormControl>
                  <ImageUpload
                    mode={uploadMode}
                    value={singleImage}
                    onChange={(files) => {
                      // Handle different possible return types
                      if (Array.isArray(files) && files.length > 0) {
                        // If we get an array of files, take the first one
                        setSingleImage(files[0])
                      } else if (!Array.isArray(files)) {
                        // If we get a single file or undefined
                        setSingleImage(files)
                      } else {
                        // Empty array
                        setSingleImage(undefined)
                      }
                    }}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a descriptive title for your report" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Selector */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Report Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploading ? 'Uploading...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )

  // Render a drawer on mobile and a dialog on desktop
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Submit a report about an issue that needs attention in Labuan Bajo
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create New Report</DrawerTitle>
          <DrawerDescription>
            Submit a report about an issue that needs attention in Labuan Bajo
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{formContent}</div>
        <DrawerFooter className="pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
