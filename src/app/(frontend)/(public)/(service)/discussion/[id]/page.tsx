import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ArrowLeft, MessageSquare, User, AlertTriangle } from 'lucide-react'

import { Header } from '@/components/global/header/header'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Discussion, DiscussionCategory, User as UserType } from '@/payload-types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CommentList } from '@/components/discussion/comment-list'
import { CommentForm } from '@/components/discussion/comment-form'
import { Separator } from '@/components/ui/separator'

interface DiscussionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for the page
export async function generateMetadata({ params }: DiscussionDetailPageProps): Promise<Metadata> {
  const payload = await getPayloadClient()
  const { id } = await params

  try {
    const discussion = (await payload.findByID({
      collection: 'discussion',
      id: id,
    })) as Discussion

    return {
      title: `${discussion.title} | Discussion | Labuan Bajo Smart`,
      description: discussion.content.slice(0, 160),
    }
  } catch (error) {
    return {
      title: 'Discussion Not Found | Labuan Bajo Smart',
      description: 'The requested discussion could not be found.',
    }
  }
}

export default async function DiscussionDetailPage({ params }: DiscussionDetailPageProps) {
  const { id } = await params
  const payload = await getPayloadClient()

  // Fetch the discussion by ID
  let discussion: Discussion
  try {
    discussion = (await payload.findByID({
      collection: 'discussion',
      id,
      depth: 3, // Get nested data like author, categories, comments
    })) as Discussion
  } catch (error) {
    notFound()
  }

  const { title, content, author, category, status, createdAt, updatedAt, commentList } = discussion
  const authorData = author as UserType
  const categories = category as DiscussionCategory[]
  const publishDate = new Date(createdAt)
  const formattedDate = format(publishDate, 'PPp') // "Jan 1, 2021, 12:00 PM"
  const commentCount = commentList?.docs?.length || 0
  const comments = commentList?.docs || []
  const isArchived = status === 'ARCHIVED'
  const isReported = status === 'REPORTED'
  const isOpen = status === 'OPEN'

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/discussion"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Discussions
          </Link>
        </div>

        {/* Discussion Content */}
        <div className="space-y-8">
          {/* Status Alerts */}
          {!isOpen && (
            <Alert variant={isArchived ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {isArchived
                  ? 'This discussion has been archived'
                  : 'This discussion has been reported'}
              </AlertTitle>
              <AlertDescription>
                {isArchived
                  ? 'This discussion is no longer active and cannot receive new comments.'
                  : 'This discussion has been reported and is currently under review.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Discussion Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              {/* Author Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">{authorData?.fullName || 'Anonymous User'}</p>
                <p className="text-xs text-muted-foreground">Posted on {formattedDate}</p>
              </div>
            </div>

            {/* Discussion Title & Categories */}
            <div>
              <h1 className="text-2xl font-bold mb-3">{title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/discussion?category=${category.id}`}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Discussion Content */}
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Comments Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Comments ({commentCount})</span>
              </h2>
            </div>

            {/* Comment Form - Only show if discussion is open */}
            {isOpen && <CommentForm discussionId={discussion.id} />}

            {/* Comment List */}
            <CommentList comments={comments} />
          </div>
        </div>
      </main>
    </div>
  )
}
