import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ArrowLeft, MessageSquare, User, AlertTriangle } from 'lucide-react'

import { Header } from '@/components/global/header/header'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Report, ReportCategory, User as UserType } from '@/payload-types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    const report = (await payload.findByID({
      collection: 'reports',
      id: id,
    })) as Report

    return {
      title: `${report.title} | Report | Labuan Bajo Smart`,
      description: report.content.slice(0, 160),
    }
  } catch (error) {
    return {
      title: 'Report Not Found | Labuan Bajo Smart',
      description: 'The requested report could not be found.',
    }
  }
}

export default async function ReportDetailPage({ params }: DiscussionDetailPageProps) {
  const { id } = await params
  const payload = await getPayloadClient()

  // Fetch the report by ID
  let report: Report
  try {
    report = (await payload.findByID({
      collection: 'reports',
      id,
      depth: 3, // Get nested data like author, categories, comments
    })) as Report
  } catch (error) {
    notFound()
  }

  const { title, content, author, category, status, createdAt, updatedAt, adminResponse } = report
  const authorData = author as UserType
  const categories = category as ReportCategory[]
  const publishDate = new Date(createdAt)
  const formattedDate = format(publishDate, 'PPp') // "Jan 1, 2021, 12:00 PM"
  const isClosed = status === 'CLOSED'
  const isOnReview = status === 'ON_REVIEW'
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
            <Alert variant={isClosed ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {isClosed
                  ? 'This discussion has been archived'
                  : 'This discussion has been reported'}
              </AlertTitle>
              <AlertDescription>
                {isClosed
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
                <span>Admin Response</span>
              </h2>
            </div>

            {/* Comment Form - Only show if discussion is open
            {isOpen && <CommentForm discussionId={report.id} />} */}

            {adminResponse && adminResponse.length > 0 ? (
              <div className="space-y-4">
                {adminResponse.map((response, index) => {
                  const adminData = response.admin as UserType
                  return (
                    <Card key={response.id || index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {adminData?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{adminData?.fullName || 'Admin'}</p>
                            <p className="text-xs text-muted-foreground">Admin Response</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{response.comment}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No admin response yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
