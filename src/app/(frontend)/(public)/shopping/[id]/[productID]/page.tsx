import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Header } from '@/components/global/header/header'
import { ShopProduct, ProductVariant } from '@/payload-types'
import ProductDetail from './components/product-detail'
import RelatedProducts from './components/related-products'
import { auth } from '@clerk/nextjs/server'

type Props = {
  params: Promise<{
    id: string // Shop ID
    productID: string // Product ID
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const payload = await getPayloadClient()

  const { productID } = await params

  try {
    const product = (await payload.findByID({
      collection: 'shopProducts',
      id: productID,
      depth: 0,
    })) as ShopProduct

    return {
      title: `${product.information.name} | Labuan Bajo SMART`,
      description: product.information.description,
    }
  } catch (error) {
    return {
      title: 'Product | Labuan Bajo SMART',
      description: 'Shop for local products from Labuan Bajo',
    }
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id, productID } = await params
  const { userId } = await auth()
  const isAuthenticated = Boolean(userId)

  const payload = await getPayloadClient()

  // Fetch the product with variants and media
  let product: ShopProduct | null = null
  try {
    product = (await payload.findByID({
      collection: 'shopProducts',
      id: productID,
      depth: 2, // Get related data like variants, categories, etc.
    })) as ShopProduct
  } catch (error) {
    notFound()
  }

  // Check if product belongs to the shop
  if (
    typeof product.owner === 'number'
      ? product.owner !== Number(id)
      : product.owner.id !== Number(id)
  ) {
    notFound()
  }

  // Fetch variants separately to ensure we have all data
  let variants: ProductVariant[] = []
  if (product.variantList?.docs && product.variantList.docs.length > 0) {
    try {
      const variantIds = product.variantList.docs
        .filter((variant) => typeof variant !== 'number')
        .map((variant) => (typeof variant !== 'number' ? variant.id : null))
        .filter(Boolean)

      if (variantIds.length > 0) {
        const variantsData = await payload.find({
          collection: 'productVariant',
          where: {
            id: {
              in: variantIds,
            },
          },
          depth: 1,
        })

        variants = variantsData.docs as ProductVariant[]
      }
    } catch (error) {
      console.error('Error fetching variants:', error)
    }
  }

  // Fetch other products from the same shop (limit to 3)
  let shopProducts: ShopProduct[] = []
  try {
    const shopProductsData = await payload.find({
      collection: 'shopProducts',
      where: {
        owner: {
          equals: id,
        },
        id: {
          not_equals: productID,
        },
      },
      limit: 3,
      depth: 1,
    })

    shopProducts = shopProductsData.docs as ShopProduct[]
  } catch (error) {
    console.error('Error fetching shop products:', error)
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductDetail product={product} variants={variants} isAuthenticated={isAuthenticated} />

        {shopProducts.length > 0 && (
          <RelatedProducts
            products={shopProducts}
            shopId={Number(id)}
            shopName={typeof product.owner !== 'number' ? product.owner.shopName || '' : ''}
          />
        )}
      </main>
    </>
  )
}
