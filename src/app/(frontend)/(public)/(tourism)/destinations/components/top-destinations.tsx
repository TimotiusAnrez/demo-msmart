'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Location, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DefaultAssets } from '@/types/globals.enum'

interface TopDestinationsProps {
  destinations: Location[]
}

export function TopDestinations({ destinations }: TopDestinationsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)

  // If no destinations, don't render
  if (!destinations.length) return null

  // Create tabs from destination names
  const tabs = destinations.map((dest) => dest.name)

  // Function to handle next slide
  const handleNext = () => {
    setActiveIndex((prev) => (prev === destinations.length - 1 ? 0 : prev + 1))
  }

  // Function to handle previous slide
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? destinations.length - 1 : prev - 1))
  }

  // Drag handlers for mobile swipe
  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if ('touches' in e) {
      setDragStartX(e.touches[0].clientX)
    } else {
      setDragStartX(e.clientX)
    }
  }

  const handleDragEnd = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!dragStartX) return

    let endX: number
    if ('changedTouches' in e) {
      endX = e.changedTouches[0].clientX
    } else {
      endX = e.clientX
    }

    const diff = dragStartX - endX
    if (Math.abs(diff) > 50) {
      // Minimum drag distance
      if (diff > 0) {
        handleNext() // Swiped left
      } else {
        handlePrev() // Swiped right
      }
    }
    setDragStartX(0)
  }

  // Get the current active destination
  const activeDestination = destinations[activeIndex]

  // Get the main image from the media gallery
  let url: string = DefaultAssets.PRODUCT
  if (activeDestination.MediaGallery && activeDestination.MediaGallery[0].media) {
    let media = activeDestination.MediaGallery[0].media as Media
    url = media.sizes?.tablet?.url || DefaultAssets.PRODUCT
  }

  const mainImageUrl = url

  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#174140]">Top Destination</h2>
        <h2 className="text-3xl md:text-4xl font-bold text-[#174140] mt-1">Top Destination</h2>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            variant={activeIndex === index ? 'default' : 'outline'}
            className={`rounded-full ${activeIndex === index ? 'bg-[#26B0C2] hover:bg-[#26B0C2]/90' : 'bg-white text-gray-700'}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div
        className="relative overflow-hidden rounded-lg"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => setDragStartX(0)}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={mainImageUrl}
            alt={activeDestination.name}
            fill
            className="object-cover rounded-lg"
            priority
          />

          {/* Destination info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h3 className="text-xl md:text-2xl font-bold">{activeDestination.name}</h3>
            <p className="text-sm md:text-base mt-1">
              {activeDestination.category &&
              activeDestination.category.length > 0 &&
              typeof activeDestination.category[0] !== 'number'
                ? activeDestination.category[0].name
                : 'Tourist Destination'}
            </p>
            <div className="mt-3">
              <Link href={`/destinations/${activeDestination.id}`}>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white/20 hover:text-white"
                >
                  View All
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next</span>
            </Button>
          </div>

          {/* Drag indicator for mobile */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-full text-sm hidden md:flex items-center space-x-2">
            <span>DRAG</span>
            <span className="flex">
              <ChevronLeft className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
