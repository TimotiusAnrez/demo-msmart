import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Header } from '@/components/global/header/header'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function ReportDetailLoading() {
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
          {/* Report Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {/* Header with author info and status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Author Avatar Skeleton */}
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Status Badge Skeleton */}
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Report Title & Categories */}
            <div>
              {/* Title Skeleton */}
              <Skeleton className="h-8 w-3/4 mb-3" />

              {/* Categories Skeleton */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Content Skeleton */}
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Image Skeleton */}
              <Skeleton className="h-64 w-full rounded-lg mt-4" />
            </div>
          </div>

          <Separator className="my-8" />

          {/* Admin Responses Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
            </div>

            {/* Admin Responses Skeleton */}
            <div className="space-y-4">
              {/* Response Skeleton */}
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <Skeleton className="h-48 w-full rounded-lg" />
              </div>

              {/* Second Response Skeleton */}
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
