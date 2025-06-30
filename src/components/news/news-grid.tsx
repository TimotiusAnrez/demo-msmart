import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

import { News, Media, NewsCategory } from '@/payload-types'
import { cn } from '@/lib/utils'

interface NewsGridProps {
  news: News[]
}

export function NewsGrid({ news }: NewsGridProps) {
  if (!news.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium">No articles found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter to find what you looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  )
}

interface NewsCardProps {
  article: News
}

function NewsCard({ article }: NewsCardProps) {
  const banner = article.meta.banner as Media
  const categories = article.meta.category as NewsCategory[]
  const firstCategory = categories[0]

  // Format the date
  const publishDate = new Date(article.createdAt)
  const formattedDate = format(publishDate, 'MMM dd, yyyy')

  return (
    <Link
      href={`/news/${article.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
    >
      {/* Article Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {banner?.url ? (
          <Image
            src={banner.url}
            alt={banner.alt || article.meta.title}
            width={500}
            height={500}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <div className="mb-2">
          <span
            className={cn(
              'inline-block text-xs font-medium uppercase tracking-wider',
              firstCategory ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {firstCategory?.name || 'Uncategorized'}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary">
          {article.meta.title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {article.meta.description}
        </p>

        {/* Date and Author Placeholder */}
        <div className="mt-4 flex items-center gap-2 pt-2 text-sm text-muted-foreground">
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  )
}
