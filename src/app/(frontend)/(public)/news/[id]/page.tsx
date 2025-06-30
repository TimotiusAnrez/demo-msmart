import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, CalendarIcon, Clock } from 'lucide-react'

import { Header } from '@/components/global/header/header'
import { RenderBlocks } from '@/components/blocks/render-blocks'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { News, NewsCategory, Media } from '@/payload-types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DefaultAssets } from '@/types/globals.enum'

interface NewsDetailPageProps {
  params: Promise<{ id: string }>
}

// Generate metadata for the page
export async function generateMetadata({ params }: NewsDetailPageProps) {
  const payload = await getPayloadClient()

  const { id } = await params

  try {
    const article = await payload.findByID({
      collection: 'news',
      id: id,
      depth: 3,
    })

    const banner = article.meta.banner as Media

    return {
      title: `${article.meta.title} | Labuan Bajo News`,
      description: article.meta.description,
      openGraph: {
        images: banner.sizes?.tablet ? [banner.sizes?.tablet?.url] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Article Not Found | Labuan Bajo News',
      description: 'The requested article could not be found.',
    }
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const payload = await getPayloadClient()
  const { id } = await params

  // Fetch the article by ID
  let article: News
  try {
    article = (await payload.findByID({
      collection: 'news',
      id: id,
      depth: 2, // Get nested data
    })) as News
  } catch (error) {
    notFound()
  }

  // Extract article data
  const { meta, newsContentSection, createdAt } = article
  const categories = meta.category as NewsCategory[]
  const banner = meta.banner as Media
  const publishDate = new Date(createdAt)
  const formattedDate = format(publishDate, 'MMMM dd, yyyy')
  const readingTime = '8 min' // This would be calculated based on content length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Back Link */}
        <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </div>

        {/* Hero Section with Image and Meta */}
        <section className="mb-12 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start md:gap-12 ">
              {/* Image Container - Left side on desktop, full width on mobile */}
              {banner?.url && (
                <div className="relative mb-8 w-full md:mb-0 md:w-1/2">
                  <div className="relative max-h-[33vh] overflow-hidden rounded-lg md:max-h-[50vh]">
                    <Image
                      src={banner.url}
                      alt={banner.alt || meta.title}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Meta Content - Right side on desktop, below image on mobile */}
              <div className="flex flex-1 flex-col justify-center">
                {/* Categories */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/news?category=${category.id}`}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {/* Title */}
                <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {meta.title}
                </h1>

                {/* Date and Reading Time */}
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <time dateTime={publishDate.toISOString()}>{formattedDate}</time>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{readingTime}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="mb-6 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>LB</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Labuan Bajo Admin</p>
                    <p className="text-xs text-muted-foreground">Content Writer</p>
                  </div>
                </div>

                {/* Description Summary */}
                <p className="text-lg leading-relaxed text-muted-foreground">{meta.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto max-w-4xl dark:prose-invert">
            <RenderBlocks blocks={newsContentSection} />
          </div>
        </section>
      </main>
    </div>
  )
}
