'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Media, ShopProduct } from '@/payload-types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

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

  const media = product.information.mediaGallery?.[0]?.media as Media
  const owner = typeof product.owner === 'number' ? product.owner : product.owner.id

  return (
    <Card className="overflow-hidden group h-full flex flex-col p-0 hover:shadow-lg duration-300 hover:cursor-pointer">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/shopping/${owner}/${product.id}`}>
          {media && 'url' in media ? (
            <Image
              src={media.url || '/placeholder.jpg'}
              alt={product.information.name}
              fill
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

        {/* Display product rating if available */}
        {/* <div className="flex items-center mt-1">
          <div className="flex items-center">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(4 + Math.random()) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            <span className="ml-1 text-xs text-gray-500">
              ({Math.floor(Math.random() * 100) + 1})
            </span>
          </div>
        </div> */}
      </CardContent>

      <CardFooter className="pt-0 pb-6 flex justify-between items-center">
        {price !== undefined ? (
          <div className="font-semibold text-lg">{formatPrice(price)}</div>
        ) : (
          <div className="font-semibold text-lg">Price varies</div>
        )}

        <Link
          href={`/shopping/${owner}/${product.id}`}
          className="text-xs text-blue-600 hover:underline"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}
