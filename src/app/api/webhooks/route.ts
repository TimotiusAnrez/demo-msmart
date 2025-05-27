import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  const evt = await verifyWebhook(req)
  try {
    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type

    if (!id) return new Response('No user id', { status: 403 })

    if (eventType === 'user.created') {
      // Verify id exists in the webhook data
      if (!id) {
        return new Response('Forbidden: No user id provided', { status: 403 })
      }

      const clerk = await clerkClient()
      const user = await clerk.users.updateUser(id, {
        publicMetadata: {
          onboardingComplete: false,
        },
      })

      console.log('User Created', user)
      return new Response('User Successfully Created', { status: 200 })
    }

    if (eventType === 'user.updated') {
      console.log('User Updated', id)
      return new Response('User Successfully Updated', { status: 200 })
    }

    if (eventType === 'user.deleted') {
      const payload = await getPayload({ config })

      const user = await payload.find({
        collection: 'users',
        where: {
          clerkID: {
            equals: id,
          },
        },
      })

      if (!user) {
        return new Response('already deleted from payload', { status: 200 })
      }

      await payload.delete({
        collection: 'users',
        id: user.docs[0].id,
      })

      return new Response('User Successfully Deleted', { status: 200 })
    }

    return new Response('User not created', { status: 500 })
  } catch (err) {
    console.log(err)
    const { id } = evt.data
    const clerk = await clerkClient()

    if (!id) return new Response('No user id', { status: 403 })

    clerk.users.deleteUser(id)
    return new Response('Webhook Error', { status: 400 })
  }
}
