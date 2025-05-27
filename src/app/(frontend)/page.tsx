import { HeroSection, SiteConfig } from '@/components/frontend/landing/hero-section'
import { LocalBusinesses } from '@/components/frontend/landing/local-businesses'
import { BusinessCategories } from '@/components/frontend/landing/business-categories'
import { Header } from '@/components/global/header'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Shop } from '@/payload-types'

export default async function HomePage() {
  const data: SiteConfig = {
    siteName: 'MSmart',
    heroTitle: 'Explore Local Businesses',
    heroSubtitle: 'Discover authentic local experiences and support our community businesses',
    heroLocation: 'Local Business',
    tagline:
      "Support local entrepreneurs and discover unique products that showcase our region's character",
    categories: ['Restaurants', 'Hotels', 'Businesses', 'Travel Planner'],
    contact: {
      address: '123 Main St, City, Country',
      phone: '+123456789',
      email: 'contact@msmart.com',
    },
    social: {
      facebook: 'https://facebook.com/msmart',
      twitter: 'https://twitter.com/msmart',
      instagram: 'https://instagram.com/msmart',
      youtube: 'https://youtube.com/msmart',
    },
  }

  const payload = await getPayload({ config })

  const categoryList = await payload.find({
    collection: 'shopCategories',
    depth: 2,
    pagination: false,
    limit: 10,
  })

  const busienssList = categoryList.docs.map((category) => {
    return category.shopList?.docs?.map((shop) => {
      return shop as Shop
    })
  })

  return (
    <div className="landing-page">
      <Header />
      <HeroSection data={data} />
      <BusinessCategories categories={categoryList.docs} />
      <LocalBusinesses businesses={busienssList[0] || []} />
    </div>
  )
}
