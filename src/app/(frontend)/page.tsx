import { Media, Shop } from '@/payload-types'
import { Header } from '@/components/global/header/header'
import { HeroSection } from '@/components/homepage/hero-section'
import { SearchFilter } from '@/components/homepage/search-filter'
import { getPayloadClient } from '@/lib/payload/payload-client'

export default async function HomePage() {
  const payload = await getPayloadClient()

  // Fetch landing page data from the global
  const landingPageData = await payload.findGlobal({
    slug: 'landingPage',
    depth: 2,
  })

  // Get hero section data with defaults for missing fields
  const heroData = {
    title: landingPageData.heroSection?.title || 'Discover Labuan Bajo',
    tagLine:
      landingPageData.heroSection?.tagLine || 'Explore the gateway to the Komodo National Park',
    copy:
      landingPageData.heroSection?.copy ||
      'Experience the beauty of East Nusa Tenggara with its pristine beaches, fascinating wildlife, and stunning landscapes.',
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

      {/* Hero Section with Search */}
      <div className="relative">
        <HeroSection
          title={heroData.title}
          tagLine={heroData.tagLine}
          copy={heroData.copy}
          bannerImage={heroData.bannerImage}
        />
        <SearchFilter />
      </div>

      {/* Additional sections can be added here */}
    </div>
  )
}
