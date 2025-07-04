'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Media, ShopProduct } from '@/payload-types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { DefaultAssets } from '@/types/globals.enum'

interface ProductCardProps {
  product: ShopProduct
}

export function ProductCard({ product }: ProductCardProps) {
  // Find the cheapest variant to display price
  const lowestPriceVariant = product.variantList?.docs?.reduce((lowest, current) => {
    if (typeof current !== 'number' && typeof lowest !== 'number') {
      return current.price < lowest.price ? current : lowest
    }
    return lowest
  }, product.variantList?.docs?.[0])

  // Get the product price to display
  const price = typeof lowestPriceVariant !== 'number' ? lowestPriceVariant?.price : undefined

  // Get the shop name to display
  const shopName = typeof product.owner !== 'number' ? product.owner.shopName : ''

  const media = (product.information.mediaGallery?.[0]?.media as Media) || DefaultAssets.PRODUCT
  const owner = typeof product.owner === 'number' ? product.owner : product.owner.id

  return (
    <Card className="overflow-hidden group h-full flex flex-col p-0 hover:shadow-lg duration-300 hover:cursor-pointer">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/shopping/${owner}/${product.id}`}>
          {media && 'url' in media ? (
            <Image
              src={media.url || '/placeholder.jpg'}
              alt={product.information.name}
              width={1280}
              height={720}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </Link>

        {/* Popular badge - Could be based on sales data or featured status
        {Math.random() > 0.7 && (
          <Badge
            variant="default"
            className="absolute top-2 left-2 bg-green-500 hover:bg-green-600"
          >
            Popular
          </Badge>
        )}

        {/* Sale badge - Could be based on discount data */}
        {/* {Math.random() > 0.8 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            20% Off
          </Badge>
        )} */}
      </div>

      <CardContent className="pt-4 flex-grow">
        <Link href={`/shopping/product/${product.id}`} className="block">
          <h3 className="font-medium text-lg line-clamp-1 mb-1">{product.information.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{shopName}</p>
      </CardContent>

      <CardFooter className="pt-0 pb-6 flex justify-between items-center">
        {price !== undefined ? (
          <div className="font-semibold text-lg">{formatPrice(price)}</div>
        ) : (
          <div className="font-semibold text-lg">Price varies</div>
        )}

        <Link
          href={`/shopping/${owner}/${product.id}`}
          className="text-xs text-primary hover:underline"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}
