import Image from 'next/image'

import { Media } from '@/payload-types'

interface HeroSectionProps {
  title: string
  tagLine: string
  copy: string
  bannerImage?: Media | null
}

export function HeroSection({ title, tagLine, copy, bannerImage }: HeroSectionProps) {
  return (
    <section className="relative">
      {/* Hero Background - Conditional Rendering */}
      {bannerImage?.url ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage.url}
            alt={bannerImage.alt || 'Hero background'}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay for text readability */}
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-primary" />
      )}

      {/* Hero Content */}
      <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-xl text-white/90 font-medium">{tagLine}</p>
          <p className="mt-6 text-base text-white/80">{copy}</p>
        </div>
      </div>
    </section>
  )
}
