'use client'

import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { AlertCircle, User } from 'lucide-react'
import { Suspense } from 'react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Report, ReportCategory, User as UserType } from '@/payload-types'
import { cn } from '@/lib/utils'
import { ReportPagination } from '@/components/report/report-pagination'
import { NavigationLink } from '@/types/globals.enum'
import { Spinner } from '../global/loading/spinner'
import { Badge } from '@/components/ui/badge'

interface ReportListProps {
  reports: Report[]
  currentPage: number
  totalPages: number
}

function LoadingList() {
  return <Spinner />
}

export function ReportList({ reports, currentPage, totalPages }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            We couldn't find any reports that match your search criteria. Try adjusting your filters
            or submit a new report.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<LoadingList />}>
      <div className="space-y-8">
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>

        <ReportPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </Suspense>
  )
}

interface ReportCardProps {
  report: Report
}

function ReportCard({ report }: ReportCardProps) {
  const { title, content, author, category, createdAt, status } = report
  const authorData = author as UserType
  const categories = category as ReportCategory[]
  const publishDate = new Date(createdAt)
  const formattedDate = format(publishDate, 'PPp') // "Jan 1, 2021, 12:00 PM"

  // Truncate content for preview (max 150 chars)
  const contentPreview = content.length > 150 ? `${content.substring(0, 150)}...` : content

  const router = useRouter()

  const handleReportClick = () => {
    router.push(`${NavigationLink.REPORT}/${report.id}`)
  }

  // Status badge styles
  const getStatusBadge = () => {
    switch (status) {
      case 'OPEN':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Open
          </Badge>
        )
      case 'ON_REVIEW':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            On Review
          </Badge>
        )
      case 'CLOSED':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div
      className="hover:cursor-pointer hover:bg-green-200/50 rounded-lg border bg-card shadow-sm transition-colors"
      onClick={handleReportClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
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

          {/* Status Badge */}
          {getStatusBadge()}
        </div>

        {/* Title & Content */}
        <div className="mt-3">
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          <p className="mt-2 text-muted-foreground">{contentPreview}</p>
        </div>

        {/* Categories */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/report?category=${cat.id}`}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-neutral-200/50"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* View Details Button */}
        <div className="mt-4">
          <Link href={`/report/${report.id}`}>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
