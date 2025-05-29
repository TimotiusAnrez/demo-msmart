'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Discussion } from '@/payload-types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NavigationLink } from '@/types/globals.enum'

type CreateDiscussionParams = {
  title: string
  category: string[]
  content: string
}

export async function createDiscussion({
  title,
  category,
  content,
}: CreateDiscussionParams): Promise<{ success: boolean; message: string; data?: Discussion }> {
  try {
    // Get the authenticated user
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: 'You must be logged in to create a discussion',
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

    // Convert category strings to numbers
    const categoryIds = category.map((id) => parseInt(id))

    // Create the discussion
    const newDiscussion = await payload.create({
      collection: 'discussion',
      data: {
        title,
        author: payloadUserId,
        category: categoryIds,
        content,
        status: 'OPEN',
      },
    })

    // Revalidate the discussions page
    revalidatePath('/discussion')

    return {
      success: true,
      message: 'Discussion created successfully',
      data: newDiscussion as unknown as Discussion,
    }
  } catch (error) {
    console.error('Error creating discussion:', error)
    return {
      success: false,
      message: 'Failed to create discussion',
    }
  }
}
