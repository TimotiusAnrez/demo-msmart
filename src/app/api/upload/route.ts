import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Media } from '@/payload-types'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    // Get user info
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 })
    }

    // Get PayloadCMS user ID
    const payloadUserId = user.privateMetadata.payloadID as number | undefined
    if (!payloadUserId) {
      return NextResponse.json(
        { success: false, message: 'User not properly linked' },
        { status: 401 },
      )
    }

    // Get the form data with the file
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = (formData.get('alt') as string) || 'Uploaded image'

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    }

    // Get payload client
    const payload = await getPayloadClient()

    // Convert the File to a buffer to pass to PayloadCMS
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create the media in PayloadCMS
    const media = (await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })) as Media

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      media,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ success: false, message: 'Error uploading file' }, { status: 500 })
  }
}
