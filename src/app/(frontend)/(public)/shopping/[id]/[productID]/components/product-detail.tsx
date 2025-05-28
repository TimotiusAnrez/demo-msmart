'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { ShopProduct, ProductVariant, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'
import { addToCart } from '../actions'
import { toast } from 'sonner'

interface ProductDetailProps {
  product: ShopProduct
  variants: ProductVariant[]
  isAuthenticated: boolean
}

export default function ProductDetail({ product, variants, isAuthenticated }: ProductDetailProps) {
  const router = useRouter()

  // State for selected image in gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // State for selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length > 0 ? String(variants[0].id) : null,
  )
  // State for quantity
  const [quantity, setQuantity] = useState(1)
  // State for loading
  const [isLoading, setIsLoading] = useState(false)

  // Get media gallery from product
  const mediaGallery =
    (product.information.mediaGallery
      ?.filter((item) => item.media && typeof item.media !== 'number')
      .map((item) => item.media) as Media[]) || []

  // Get selected variant
  const selectedVariant = variants.find((v) => String(v.id) === selectedVariantId)

  // Calculate the current price based on selected variant or default price
  const currentPrice = selectedVariant ? selectedVariant.price : product.information.defaultPrice

  // Gallery navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? mediaGallery.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === mediaGallery.length - 1 ? 0 : prev + 1))
  }

  // Quantity handlers
  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      router.push('/sign-in')
      return
    }

    if (!selectedVariantId && variants.length > 0) {
      toast.error('Please select a variant')
      return
    }

    try {
      setIsLoading(true)

      // Call server action to add to cart
      const result = await addToCart({
        productId: product.id,
        variantId: selectedVariantId ? Number(selectedVariantId) : undefined,
        quantity,
      })

      if (result.success) {
        toast.success('Added to cart')
      } else {
        toast.error(result.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to add item to cart')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {/* Left column - Image Gallery */}
      <div className="space-y-4">
        {/* Main image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {mediaGallery.length > 0 && mediaGallery[currentImageIndex]?.url ? (
            <Image
              src={mediaGallery[currentImageIndex].url}
              alt={product.information.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}

          {/* Navigation arrows */}
          {mediaGallery.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {mediaGallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {mediaGallery.map((media, index) => (
              <button
                key={index}
                className={`relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                  currentImageIndex === index ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                {media.url ? (
                  <Image
                    src={media.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right column - Product Information */}
      <div className="space-y-6">
        {/* Collection name */}
        <div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            {product.category &&
            product.category.length > 0 &&
            typeof product.category[0] !== 'number'
              ? product.category[0].name
              : 'Product Collection'}
          </p>
        </div>
        <div className="information flex justify-between w-full items-start">
          <div className="main-information space-y-2">
            {/* Product title */}
            <h1 className="text-3xl font-bold">{product.information.name}</h1>

            {/* Delivery info */}
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Delivery from 3 weeks</span>
            </div>
          </div>

          {/* Price section */}
          <div className="pt-4">
            <p className="text-2xl font-semibold">{formatPrice(currentPrice)}</p>
          </div>
        </div>

        {/* Variant selection */}
        {variants.length > 0 && (
          <div className="space-y-4 pt-4">
            <p className="font-medium">Select Variant</p>
            <RadioGroup
              value={selectedVariantId || ''}
              onValueChange={setSelectedVariantId}
              className="grid grid-cols-2 gap-4"
            >
              {variants.map((variant) => (
                <div key={variant.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={String(variant.id)} id={`variant-${variant.id}`} />
                  <Label htmlFor={`variant-${variant.id}`} className="flex flex-col">
                    <span>{variant.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(variant.price)}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Quantity selector */}
        <div className="flex items-center space-x-4 pt-4">
          <p className="font-medium">Quantity</p>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="h-8 w-8 rounded-r-none"
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease</span>
            </Button>
            <div className="h-8 px-3 flex items-center justify-center border border-input bg-background">
              {quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={increaseQuantity}
              className="h-8 w-8 rounded-l-none"
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
        </div>

        {/* Add to cart button */}
        <div className="grid grid-cols-1 pt-6 gap-4">
          <Button onClick={handleAddToCart} disabled={isLoading} className="w-full">
            {isLoading ? 'Adding...' : 'Add to cart'}
          </Button>
        </div>

        {/* Description */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Description</h2>
          </div>
          <Separator />
          <div className="prose prose-sm max-w-none">
            <p>{product.information.description}</p>
          </div>
        </div>

        {/* Dimensions (dummy) */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Dimensions</h2>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Product dimensions:</p>
              <p>H84.5 x W64 x D75cm</p>
            </div>
            <div>
              <p className="text-muted-foreground">Product weight:</p>
              <p>15.8kg</p>
            </div>
          </div>
        </div>

        {/* Details (dummy) */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Product Details</h2>
          </div>
          <Separator />
          <div className="prose prose-sm max-w-none">
            <p>
              Handcrafted with a solid frame allowing for a comfortable experience with high-quality
              materials. The product comes with a 1-year warranty on manufacturing defects.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
