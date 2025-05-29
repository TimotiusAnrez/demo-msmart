import Image from 'next/image'
import Link from 'next/link'
import { Media, ShopProduct } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NewestProductsProps {
  products: ShopProduct[]
}

export function NewestProducts({ products }: NewestProductsProps) {
  if (products.length === 0) return null

  const featuredProduct = products[0]
  const featuredProductMedia = featuredProduct.information.mediaGallery?.[0]?.media as Media

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-primary font-medium">Only the best goods for you.</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Newest Local Offering
          </h2>
        </div>
        <Link href="#product-catalog">
          <Button variant="default" className="bg-primary hover:bg-primary/80">
            Explore All Products <span className="ml-2">→</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Feature the first product prominently */}
        {products.length > 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-6 overflow-hidden rounded-lg">
            <Link
              href={`/shopping/product/${products[0].id}`}
              className="group block relative h-[400px]"
            >
              {featuredProductMedia && 'url' in featuredProductMedia ? (
                <Image
                  src={featuredProductMedia.url || '/placeholder.jpg'}
                  alt={featuredProduct.information.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-xl font-semibold text-white">
                  {featuredProduct.information.name}
                </h3>
                {typeof featuredProduct.owner !== 'number' && (
                  <p className="text-white/80 text-sm">From {featuredProduct.owner.shopName}</p>
                )}
              </div>
            </Link>
          </div>
        )}

        {/* Secondary products grid */}
        <div className="col-span-1 md:col-span-2 lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.slice(1, 4).map((product) => {
            const media = product.information.mediaGallery?.[0]?.media as Media

            return (
              <Link
                key={product.id}
                href={`/shopping/product/${product.id}`}
                className="group block relative h-[200px] overflow-hidden rounded-lg"
              >
                {product.information.mediaGallery &&
                product.information.mediaGallery[0]?.media &&
                'url' in media ? (
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

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-base font-medium text-white">{product.information.name}</h3>
                  {typeof product.owner !== 'number' && (
                    <p className="text-white/80 text-xs">From {product.owner.shopName}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
