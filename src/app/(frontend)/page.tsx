import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Camera, Waves, Mountain } from 'lucide-react'

import { Media, Shop } from '@/payload-types'
import { Header } from '@/components/global/header/header'
import { HeroSection } from '@/components/homepage/hero-section'
import { SearchFilter } from '@/components/homepage/search-filter'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { AnimatedIcon } from '@/components/global/loading/tropical-loading'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export function Maintenance({ message }: { message: string }) {
  return (
    <div className="w-full h-full py-24  flex flex-col gap-y-10 items-center justify-center">
      <h1 className="text-2xl font-semibold">{message}</h1>
      <AnimatedIcon />
    </div>
  )
}

export default async function HomePage() {
  const payload = await getPayloadClient()

  // Fetch landing page data from the global
  const landingPageData = await payload.findGlobal({
    slug: 'landingPage',
    depth: 2,
  })

  // Get hero section data with defaults for missing fields
  const heroData = {
    title: landingPageData.heroSection?.title || 'Things to Do in Labuan Bajo',
    tagLine: landingPageData.heroSection?.tagLine || 'Discover the gateway to Komodo National Park',
    copy:
      landingPageData.heroSection?.copy ||
      'Check out must-see sights and activities: Padar Island, Rangko Cave, Multi-day Tours, Islands. For personalized recommendations, try our AI trip-planning product.',
    bannerImage: (landingPageData.heroSection?.bannerImage as Media) || null,
  }

  // Keeping the existing code for shop categories for future use
  const categoryList = await payload.find({
    collection: 'shopCategories',
    depth: 2,
    pagination: false,
    limit: 10,
  })

  const businessList = categoryList.docs.map((category) => {
    return category.shopList?.docs?.map((shop) => {
      return shop as Shop
    })
  })

  return (
    <div className="landing-page">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {heroData.bannerImage?.url ? (
            <Image
              src={heroData.bannerImage.url}
              alt={heroData.bannerImage.alt || 'Labuan Bajo scenic view'}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400" />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {heroData.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 font-medium">{heroData.tagLine}</p>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-white/80 leading-relaxed">{heroData.copy}</p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-white/90">
                    <Mountain className="h-5 w-5" />
                    <span className="text-sm font-medium">Padar Island</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/90">
                    <Waves className="h-5 w-5" />
                    <span className="text-sm font-medium">Rangko Cave</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/90">
                    <Camera className="h-5 w-5" />
                    <span className="text-sm font-medium">Multi-day Tours</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/90">
                    <MapPin className="h-5 w-5" />
                    <span className="text-sm font-medium">Islands</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    <Link href="/shopping" className="flex items-center gap-2">
                      <span>Explore</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Mountain className="h-6 w-6 text-blue-200" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Iconic Landscapes</h3>
                        <p className="text-sm text-white/70">
                          Discover breathtaking views and natural wonders
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Waves className="h-6 w-6 text-cyan-200" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Marine Adventures</h3>
                        <p className="text-sm text-white/70">
                          Explore pristine waters and marine life
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Camera className="h-6 w-6 text-green-200" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Cultural Experiences</h3>
                        <p className="text-sm text-white/70">
                          Immerse in local culture and traditions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Start Your Adventure
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for the perfect Labuan Bajo experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Places</h3>
                <p className="text-gray-600 mb-4">Discover amazing destinations and hidden gems</p>
                <Button asChild variant="outline">
                  <Link href="/facility">View Facilities</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Waves className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Products</h3>
                <p className="text-gray-600 mb-4">Shop authentic local products and souvenirs</p>
                <Button asChild variant="outline">
                  <Link href="/shopping">Shop Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Produce</h3>
                <p className="text-gray-600 mb-4">Get fresh local produce from farmers</p>
                <Button asChild variant="outline">
                  <Link href="/agriculture">Browse Agriculture</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
