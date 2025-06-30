import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Phone, Globe, Mail } from 'lucide-react'
import { Shop, ShopProduct } from '@/payload-types'
import { DefaultAssets } from '@/types/globals.enum'

interface LocalBusinessesProps {
  businesses: Shop[]
}

export function LocalBusinesses({ businesses }: LocalBusinessesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Local Business Directory
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Support local entrepreneurs and discover unique products that showcase our regions
            character
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {businesses.map((business: Shop) => {
            const data = {
              information: {
                ...business.information,
              },
              location: {
                ...business.location,
              },
              image:
                typeof business.mediaGallery === 'number' ||
                !business.mediaGallery ||
                business.mediaGallery.length < 1 ||
                !business.mediaGallery[0].media ||
                typeof business.mediaGallery[0].media === 'number'
                  ? DefaultAssets.PRODUCT
                  : business.mediaGallery[0].media.sizes?.card?.url,
              category: typeof business.category === 'number' ? 'other' : business.category.name,
              id: business.id,
            }

            return (
              <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={data.image || '/placeholder.svg'}
                    alt={data.information.tradingName || 'Business Image'}
                    width={500}
                    height={500}
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/80">{data.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{business.information.tradingName}</h3>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Featured Products:</h4>
                    <div className="flex flex-wrap gap-2">
                      {business.productList?.docs?.map((product) => {
                        if (typeof product === 'number') return null
                        return (
                          <Badge key={product.id} variant="outline" className="text-xs">
                            {product.information.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{business.contact?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{business.contact?.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      Contact
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/80">Visit Store</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            View All Local Businesses
          </Button>
        </div>
      </div>
    </section>
  )
}
