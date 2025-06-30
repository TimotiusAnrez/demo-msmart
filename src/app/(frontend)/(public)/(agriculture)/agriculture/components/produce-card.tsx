import Image from 'next/image'
import Link from 'next/link'
import { FarmerProduce, Media } from '@/payload-types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { DefaultAssets } from '@/types/globals.enum'

interface ProduceCardProps {
  produce: FarmerProduce
}

export function ProduceCard({ produce }: ProduceCardProps) {
  // Get the first image from media gallery or use a placeholder

  let imageUrl: string = DefaultAssets.PRODUCT

  if (produce.mediaGalery?.[0]?.image) {
    const image = produce.mediaGalery[0].image as Media

    imageUrl = image.sizes?.card?.url || DefaultAssets.PRODUCT
  }

  // Format price
  const price = formatPrice(produce.price.nominal)

  let farmerId: number = 0

  if (typeof produce.farmer === 'object') {
    farmerId = produce.farmer.id
  }

  return (
    <Link href={`/agriculture/${farmerId}/${produce.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={produce.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{produce.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {typeof produce.category === 'object' ? produce.category.name : ''}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available:</p>
              <p className="font-medium">
                {produce.stock.quantity} {produce.stock.unit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Price:</p>
              <p className="font-bold text-primary">
                {price}/{produce.price.unit}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t">
          <div className="w-full">
            <p className="text-sm text-muted-foreground">Farmer:</p>
            <p className="font-medium truncate">
              {typeof produce.farmer === 'object' && produce.farmer.personal
                ? `${produce.farmer.personal.firstName} ${produce.farmer.personal.lastName}`
                : 'Unknown Farmer'}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
