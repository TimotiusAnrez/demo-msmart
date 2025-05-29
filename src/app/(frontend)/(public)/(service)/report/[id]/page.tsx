import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ArrowLeft, ClipboardCheck, User, AlertTriangle, Clock, CheckCircle } from 'lucide-react'

import { Header } from '@/components/global/header/header'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Report, ReportCategory, User as UserType, Media } from '@/payload-types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ReportDetailPageProps {
  params: {
    id: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: ReportDetailPageProps): Promise<Metadata> {
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

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params
  const payload = await getPayloadClient()

  // Fetch the report by ID
  let report: Report
  try {
    report = (await payload.findByID({
      collection: 'reports',
      id,
      depth: 3, // Get nested data like author, categories, admin responses
    })) as Report
  } catch (error) {
    notFound()
  }

  const { title, content, author, category, status, createdAt, media, adminResponse } = report
  const authorData = author as UserType
  const categories = category as ReportCategory[]
  const reportImage = media as Media
  const publishDate = new Date(createdAt)
  const formattedDate = format(publishDate, 'PPp') // "Jan 1, 2021, 12:00 PM"
  const adminResponses = adminResponse || []
  const hasAdminResponses = adminResponses.length > 0

  // Status information
  const isClosed = status === 'CLOSED'
  const isOnReview = status === 'ON_REVIEW'
  const isOpen = status === 'OPEN'

  // Get status badge
  const getStatusBadge = () => {
    switch (status) {
      case 'OPEN':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Open
          </Badge>
        )
      case 'ON_REVIEW':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            On Review
          </Badge>
        )
      case 'CLOSED':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'OPEN':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'ON_REVIEW':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/report"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Link>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
          {/* Status Alert for closed or on review reports */}
          {!isOpen && (
            <Alert variant={isClosed ? 'default' : 'info'}>
              {getStatusIcon()}
              <AlertTitle>
                {isClosed ? 'This report has been closed' : 'This report is currently under review'}
              </AlertTitle>
              <AlertDescription>
                {isClosed
                  ? 'This report has been addressed and is now closed.'
                  : 'Our team is currently reviewing this report.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Report Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {/* Header with author info and status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Author Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{authorData?.fullName || 'Anonymous User'}</p>
                  <p className="text-xs text-muted-foreground">Reported on {formattedDate}</p>
                </div>
              </div>

              {/* Status Badge */}
              {getStatusBadge()}
            </div>

            {/* Report Title & Categories */}
            <div>
              <h1 className="text-2xl font-bold mb-3">{title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/report?category=${category.id}`}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="content space-y-4">
                {/* Report Image */}
                {reportImage && reportImage.url && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer overflow-hidden h-96 rounded-lg border transition-all hover:opacity-90">
                        <Image
                          src={reportImage.url}
                          alt={reportImage.alt || 'Report image'}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="lg:w-[1280px] lg:h-[720px] w-full h-full p-10">
                      <Image
                        src={reportImage.url}
                        alt={reportImage.alt || 'Report image'}
                        width={800}
                        height={1280}
                        className="w-full h-full object-cover object-center rounded-2xl"
                      />
                    </DialogContent>
                  </Dialog>
                )}
                {/* Report Content */}
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="whitespace-pre-wrap">{content}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Admin Responses Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                <span>Admin Responses {hasAdminResponses ? `(${adminResponses.length})` : ''}</span>
              </h2>
            </div>

            {hasAdminResponses ? (
              <div className="space-y-4">
                {adminResponses.map((response, index) => {
                  const admin = response.admin as UserType
                  const responseMedia = response.media as Media
                  const responseDate = new Date(report.updatedAt)
                  const formattedResponseDate = format(responseDate, 'PPp')

                  return (
                    <div
                      key={response.id || index}
                      className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {/* Admin Avatar */}
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>

                        {/* Response Image */}
                        {responseMedia && responseMedia.url && (
                          <div className="overflow-hidden aspect-square h-24 rounded-lg border">
                            <Image
                              src={responseMedia.url}
                              alt={responseMedia.alt || 'Response image'}
                              width={600}
                              height={400}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{admin?.fullName || 'Administrator'}</p>
                          <p className="text-xs text-muted-foreground">
                            Responded on {formattedResponseDate}
                          </p>
                        </div>
                      </div>

                      {/* Response Content */}
                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="whitespace-pre-wrap">{response.comment}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-[150px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <ClipboardCheck className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No responses yet</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Our team has not yet responded to this report. We'll provide an update as soon
                    as possible.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
