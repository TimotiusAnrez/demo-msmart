'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { DiscussionComment } from '@/payload-types'
import { revalidatePath } from 'next/cache'

type CreateCommentParams = {
  content: string
  discussionId: number
}

export async function createComment({
  content,
  discussionId,
}: CreateCommentParams): Promise<{ success: boolean; message: string; data?: DiscussionComment }> {
  try {
    // Get the authenticated user
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: 'You must be logged in to comment',
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

    // Create the discussion comment
    const newComment = await payload.create({
      collection: 'discussionComment',
      data: {
        commenter: payloadUserId,
        content,
        discussion: discussionId,
      },
    })

    // Revalidate the discussion page to show the new comment
    revalidatePath(`/discussions/${discussionId}`)

    return {
      success: true,
      message: 'Comment added successfully',
      data: newComment as unknown as DiscussionComment,
    }
  } catch (error) {
    console.error('Error creating comment:', error)
    return {
      success: false,
      message: 'Failed to add comment',
    }
  }
}
