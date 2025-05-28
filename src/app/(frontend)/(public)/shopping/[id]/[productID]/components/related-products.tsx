import Link from 'next/link'
import { ShopProduct } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/app/(frontend)/(public)/shopping/components/product-card'

interface RelatedProductsProps {
  products: ShopProduct[]
  shopId: number
  shopName: string
}

export default function RelatedProducts({ products, shopId, shopName }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">More from {shopName}</h2>
        <Link href={`/shopping?shop=${shopId}`}>
          <Button variant="outline">View All</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
