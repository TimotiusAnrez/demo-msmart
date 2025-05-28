import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/global/header/header'
import { Spinner } from '@/components/global/loading/spinner'

export default function DiscussionDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Back Link Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="space-y-8">
          {/* Discussion Card Skeleton */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {/* Author Skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            {/* Title & Categories Skeleton */}
            <div>
              <Skeleton className="h-7 w-3/4 mb-3" />

              <div className="flex flex-wrap gap-2 mb-6">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Content Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>

          {/* Comments Section Skeleton */}
          <div className="mt-8">
            <div className="flex items-center justify-center p-12">
              <Spinner />
              <span className="ml-3 text-muted-foreground">Loading comments...</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
