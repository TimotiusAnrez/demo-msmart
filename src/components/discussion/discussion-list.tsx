'use client'

import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { MessageSquare, User } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Discussion, DiscussionCategory, User as UserType } from '@/payload-types'
import { cn } from '@/lib/utils'
import { DiscussionPagination } from './discussion-pagination'
import { useRouter } from 'next/navigation'
import { NavigationLink } from '@/types/globals.enum'
import { Spinner } from '../global/loading/spinner'
import { Suspense } from 'react'

interface DiscussionListProps {
  discussions: Discussion[]
  currentPage: number
  totalPages: number
}

function LoadingList() {
  return <Spinner />
}

export function DiscussionList({ discussions, currentPage, totalPages }: DiscussionListProps) {
  if (discussions.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No discussions found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            We could not find any discussions that match your search criteria. Try adjusting your
            filters or start a new discussion.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<LoadingList />}>
      <div className="space-y-8">
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))}
        </div>

        <DiscussionPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </Suspense>
  )
}

interface DiscussionCardProps {
  discussion: Discussion
}

function DiscussionCard({ discussion }: DiscussionCardProps) {
  const { title, content, author, category, createdAt, commentList } = discussion
  const authorData = author as UserType
  const categories = category as DiscussionCategory[]
  const publishDate = new Date(createdAt)
  const formattedDate = format(publishDate, 'PPp') // "Jan 1, 2021, 12:00 PM"
  const commentCount = commentList?.docs?.length || 0

  // Truncate content for preview (max 150 chars)
  const contentPreview = content.length > 150 ? `${content.substring(0, 150)}...` : content

  const router = useRouter()

  const handleDiscussionClick = () => {
    router.push(`${NavigationLink.DISCUSSION}/${discussion.id}`)
  }

  return (
    <div
      className="hover:cursor-pointer hover:bg-green-200/50 rounded-lg border bg-card shadow-sm transition-colors"
      onClick={handleDiscussionClick}
    >
      <div className="p-6">
        <div className="flex items-center gap-2">
          {/* Author Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          {/* Author Name & Date */}
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {authorData?.fullName || 'Anonymous User'}
            </span>
            <span className="mx-1">·</span>
            <time dateTime={publishDate.toISOString()}>{formattedDate}</time>
          </div>
        </div>

        {/* Title & Content */}
        <div className="mt-3">
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          <p className="mt-2 text-muted-foreground">{contentPreview}</p>
        </div>

        {/* Categories & Comment Count */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/discussion?category=${cat.id}`}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-neutral-200/50"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center text-muted-foreground">
            <MessageSquare className="mr-1 h-4 w-4" />
            <span className="text-sm">{commentCount} comments</span>
          </div>
        </div>

        {/* Read More Button */}
        <div className="mt-4">
          <Link href={`/discussion/${discussion.id}`}>
            <Button variant="secondary" size="sm" className="hover:cursor-pointer">
              Read More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
