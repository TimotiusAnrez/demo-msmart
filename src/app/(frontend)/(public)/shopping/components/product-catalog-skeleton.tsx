import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function ProductCatalogSkeleton() {
  return (
    <section className="py-8">
      <Skeleton className="h-8 w-64 mb-6" />

      {/* Filters and search row skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <Skeleton className="h-10 w-[200px]" />
      </div>

      <Separator className="my-6" />

      {/* Results info skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="aspect-square w-full rounded-lg mb-3" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-80" />
      </div>
    </section>
  )
}
