'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Report, Media } from '@/payload-types'
import { revalidatePath } from 'next/cache'

type CreateReportParams = {
  title: string
  content: string
  categoryId: string
  mediaId: number
}

export async function createReport({
  title,
  content,
  categoryId,
  mediaId,
}: CreateReportParams): Promise<{ success: boolean; message: string; data?: Report }> {
  try {
    // Get the authenticated user
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: 'You must be logged in to create a report',
      }
    }

    // Get user info from Clerk to find the corresponding Payload user
    const user = await currentUser()

    if (!user) {
      return {
        success: false,
        message: 'User information could not be retrieved',
      }
    }

    // Get the PayloadCMS user ID from private metadata
    const payloadUserId = user.privateMetadata.payloadID as number | undefined

    if (!payloadUserId) {
      return {
        success: false,
        message: 'User account is not properly linked',
      }
    }

    // Get the Payload client
    const payload = await getPayloadClient()

    // Create the report with the uploaded media ID if provided
    const newReport = await payload.create({
      collection: 'reports',
      data: {
        title,
        author: payloadUserId,
        category: [parseInt(categoryId)],
        content,
        status: 'OPEN',
        media: mediaId,
      },
    })

    // Revalidate the reports page
    revalidatePath('/report')

    return {
      success: true,
      message: 'Report created successfully',
      data: newReport as unknown as Report,
    }
  } catch (error) {
    console.error('Error creating report:', error)
    return {
      success: false,
      message: 'Failed to create report',
    }
  }
}
