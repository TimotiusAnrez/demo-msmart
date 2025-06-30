'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MapPin, Search } from 'lucide-react'

export interface SiteConfig {
  siteName: string
  heroTitle: string
  heroSubtitle: string
  heroLocation: string
  tagline: string
  categories: string[]
  contact: {
    address: string
    phone: string
    email: string
  }
  social: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
}

interface HeroSectionProps {
  data: SiteConfig
}

export function HeroSection({ data }: HeroSectionProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('')

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-beach.jpg"
          alt="Beautiful local destination"
          width={500}
          height={500}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full py-20">
          {/* Left side - Hero text */}
          <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              {data.heroLocation}
              <br />
              <span className="text-primary/40">{data.heroTitle}</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl">{data.heroSubtitle}</p>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {data.categories.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right side - Booking widget */}
          <div className="w-full lg:w-96">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary/50" />
                  Discover Hotels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="destination">Your Destination</Label>
                  <Input id="destination" placeholder="Where are you going?" className="mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="checkin">Check In</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Check Out</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Guests and Rooms</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-guest-1-room">1 Guest, 1 Room</SelectItem>
                      <SelectItem value="2-guests-1-room">2 Guests, 1 Room</SelectItem>
                      <SelectItem value="3-guests-1-room">3 Guests, 1 Room</SelectItem>
                      <SelectItem value="4-guests-2-rooms">4 Guests, 2 Rooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-primary/50 hover:bg-primary text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Search Hotels
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
