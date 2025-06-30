import Link from 'next/link'
import Image from 'next/image'
import { FarmerProduce, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { DefaultAssets } from '@/types/globals.enum'

interface NewestProduceProps {
  produce: FarmerProduce[]
}

export function NewestProduce({ produce }: NewestProduceProps) {
  if (!produce.length) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Fresh Produce</h2>
          <p className="text-muted-foreground mt-1">Latest fresh produce from local farmers</p>
        </div>
        <Link href="/agriculture?sort=-createdAt">
          <Button variant="outline" className="mt-4 md:mt-0">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {produce.map((item) => {
          let imageUrl: string = DefaultAssets.PRODUCT
          if (item.mediaGalery?.[0]?.image) {
            const image = item.mediaGalery[0].image as Media

            imageUrl = image.sizes?.card?.url || DefaultAssets.PRODUCT
          }

          // Format price
          const price = formatPrice(item.price.nominal)

          let farmerId: number = 0

          if (typeof item.farmer === 'object') {
            farmerId = item.farmer.id
          }

          return (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all">
              <Link href={`/agriculture/${farmerId}/${item.id}`}>
                <div className="relative aspect-square">
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {typeof item.category === 'object' ? item.category.name : ''}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">
                      {item.stock.quantity} {item.stock.unit}
                    </p>
                    <p className="font-bold text-primary">
                      {formatPrice(item.price.nominal)}/{item.price.unit}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 truncate">
                    {typeof item.farmer === 'object' && item.farmer.personal
                      ? `${item.farmer.personal.firstName} ${item.farmer.personal.lastName}`
                      : 'Unknown Farmer'}
                  </p>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
