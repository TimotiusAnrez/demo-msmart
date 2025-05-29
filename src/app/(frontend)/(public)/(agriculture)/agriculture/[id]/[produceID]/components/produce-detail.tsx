'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { FarmerProduce, Farmer, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface ProduceDetailProps {
  produce: FarmerProduce
  farmer: Farmer
  isAuthenticated: boolean
}

export default function ProduceDetail({ produce, farmer, isAuthenticated }: ProduceDetailProps) {
  const router = useRouter()

  // State for selected image in gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // State for quantity
  const [quantity, setQuantity] = useState(1)
  // State for loading
  const [isLoading, setIsLoading] = useState(false)

  // Get media gallery from produce
  const mediaGallery: Media[] =
    (produce.mediaGalery
      ?.filter((item) => item.image && typeof item.image !== 'number')
      .map((item) => item.image) as Media[]) || ([] as Media[])

  // Gallery navigation
  const handlePrevImage = () => {
    if (!mediaGallery.length) return
    setCurrentImageIndex((prev) => (prev === 0 ? mediaGallery.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!mediaGallery.length) return
    setCurrentImageIndex((prev) => (prev === mediaGallery.length - 1 ? 0 : prev + 1))
  }

  // Quantity handlers
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    } else if (e.target.value === '') {
      setQuantity(1) // Default to 1 for empty input
    }
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      router.push('/sign-in')
      return
    }

    try {
      setIsLoading(true)

      // Show success toast notification
      toast.success(`Added ${quantity} ${produce.stock.unit} of ${produce.name} to cart`, {
        description: `From ${farmer.personal.firstName} ${farmer.personal.lastName}`,
      })

      // Reset quantity after adding to cart
      setQuantity(1)
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
              alt={produce.name}
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

        {/* Farmer info box */}
        <div className="mt-6 p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Farmer</h3>
            <Link href={`/agriculture/${farmer.id}`}>
              <Button variant="ghost" size="sm" className="text-sm">
                View Profile
              </Button>
            </Link>
          </div>
          <Separator />
          <div className="space-y-1">
            <h4 className="font-medium">
              {farmer.personal.firstName} {farmer.personal.lastName}
            </h4>
            <p className="text-sm text-muted-foreground truncate">{farmer.location.address}</p>
            <div className="grid grid-cols-2 pt-2 gap-x-2 gap-y-1 text-sm">
              <p className="text-muted-foreground">Phone:</p>
              <p>{farmer.contact.phone}</p>
              <p className="text-muted-foreground">WhatsApp:</p>
              <p>{farmer.contact.whatsapp}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Produce Information */}
      <div className="space-y-6">
        {/* Category info */}
        <div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            {typeof produce.category === 'object' ? produce.category.name : 'Produce Category'}
          </p>
        </div>

        <div className="flex justify-between w-full items-start">
          <div className="space-y-2">
            {/* Produce title */}
            <h1 className="text-3xl font-bold">{produce.name}</h1>

            {/* Availability info */}
            <div className="flex items-center text-sm text-muted-foreground">
              <span>
                Available now: {produce.stock.quantity} {produce.stock.unit}
              </span>
            </div>
          </div>

          {/* Price section */}
          <div className="pt-4">
            <p className="text-2xl font-semibold">
              {formatPrice(produce.price.nominal)}/{produce.price.unit}
            </p>
          </div>
        </div>

        {/* Quantity selector with input */}
        <div className="flex flex-col space-y-2 pt-4">
          <p className="font-medium">Quantity ({produce.price.unit})</p>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="h-10 w-10 rounded-r-none"
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="h-10 w-24 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={increaseQuantity}
              className="h-10 w-10 rounded-l-none"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
        </div>

        {/* Total price calculation */}
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">Total price:</p>
          <p className="text-xl font-bold text-primary">
            {formatPrice(produce.price.nominal * quantity)}
          </p>
        </div>

        {/* Stock check and warning if needed */}
        {quantity > produce.stock.quantity && (
          <div className="pt-2 text-sm text-yellow-600">
            Note: Your requested quantity ({quantity} {produce.stock.unit}) exceeds available stock
            ({produce.stock.quantity} {produce.stock.unit})
          </div>
        )}

        {/* Add to cart button */}
        <div className="grid grid-cols-1 pt-6 gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || quantity <= 0}
            className="w-full"
          >
            {isLoading ? 'Adding...' : 'Add to cart'}
          </Button>
        </div>

        {/* Description */}
        <div className="pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Product Details</h2>
          </div>
          <Separator />
          <div className="prose prose-sm max-w-none">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Produce Name</p>
                <p className="text-muted-foreground">{produce.name}</p>
              </div>
              <div>
                <p className="font-medium">Category</p>
                <p className="text-muted-foreground">
                  {typeof produce.category === 'object' ? produce.category.name : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="font-medium">Unit</p>
                <p className="text-muted-foreground">{produce.price.unit}</p>
              </div>
              <div>
                <p className="font-medium">Available Stock</p>
                <p className="text-muted-foreground">
                  {produce.stock.quantity} {produce.stock.unit}
                </p>
              </div>
              <div>
                <p className="font-medium">Price Per Unit</p>
                <p className="text-muted-foreground">
                  {formatPrice(produce.price.nominal)}/{produce.price.unit}
                </p>
              </div>
              <div>
                <p className="font-medium">Origin</p>
                <p className="text-muted-foreground">{farmer.location.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Harvesting and freshness info */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Freshness Information</h2>
          </div>
          <Separator />
          <div className="prose prose-sm max-w-none">
            <p>
              This produce is locally grown and freshly harvested. For optimal freshness, we
              recommend storing in a cool, dry place and consuming within 1-2 weeks of delivery,
              depending on the type of produce.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
