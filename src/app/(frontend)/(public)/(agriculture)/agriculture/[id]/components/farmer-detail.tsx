'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { FarmerProduce, Farmer, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface FarmerDetailProps {
  farmer: Farmer
  produce: FarmerProduce[]
  isAuthenticated: boolean
}

export default function FarmerDetail({ farmer, produce, isAuthenticated }: FarmerDetailProps) {
  const router = useRouter()

  // Find the first produce item to display as default, if any
  const defaultProduce = produce.length > 0 ? produce[0] : null

  // State for selected produce item from this farmer
  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(
    defaultProduce ? String(defaultProduce.id) : null,
  )
  // State for selected image in gallery of the current produce
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // State for quantity
  const [quantity, setQuantity] = useState(1)
  // State for loading
  const [isLoading, setIsLoading] = useState(false)

  // Get the selected produce item
  const selectedProduce = selectedProduceId
    ? produce.find((p) => String(p.id) === selectedProduceId) || null
    : defaultProduce

  // Get media gallery from the selected produce
  const mediaGallery =
    (selectedProduce?.mediaGalery
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

    if (!selectedProduce) {
      toast.error('No produce selected')
      return
    }

    try {
      setIsLoading(true)

      // Show success toast - no actual cart functionality yet
      toast.success(
        `Added ${quantity} ${selectedProduce.stock.unit} of ${selectedProduce.name} to cart`,
        {
          description: `From ${farmer.personal.firstName} ${farmer.personal.lastName}`,
        },
      )

      // Reset quantity after adding to cart
      setQuantity(1)
    } catch (error) {
      toast.error('Failed to add item to cart')
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedProduce) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">No produce available from this farmer</h2>
        <p className="text-muted-foreground">Check back later for fresh produce</p>
      </div>
    )
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
              alt={selectedProduce.name}
              width={500}
              height={500}
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
                    width={500}
                    height={500}
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

        {/* Produce selection if there are multiple */}
        {produce.length > 1 && (
          <div className="mt-6 space-y-2">
            <h3 className="font-medium">Other produce from this farmer:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {produce.map((item) => (
                <Button
                  key={item.id}
                  variant={selectedProduceId === String(item.id) ? 'default' : 'outline'}
                  className="h-auto py-2 justify-start"
                  onClick={() => {
                    setSelectedProduceId(String(item.id))
                    setCurrentImageIndex(0)
                    setQuantity(1)
                  }}
                >
                  <span className="truncate">{item.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column - Product Information */}
      <div className="space-y-6">
        {/* Farmer info */}
        <div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">Farmer</p>
          <h2 className="text-xl font-semibold">
            {farmer.personal.firstName} {farmer.personal.lastName}
          </h2>
        </div>

        {/* Category info */}
        <div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            {typeof selectedProduce.category === 'object'
              ? selectedProduce.category.name
              : 'Produce Category'}
          </p>
        </div>

        <div className="information flex justify-between w-full items-start">
          <div className="main-information space-y-2">
            {/* Produce title */}
            <h1 className="text-3xl font-bold">{selectedProduce.name}</h1>

            {/* Availability info */}
            <div className="flex items-center text-sm text-muted-foreground">
              <span>
                Available now: {selectedProduce.stock.quantity} {selectedProduce.stock.unit}
              </span>
            </div>
          </div>

          {/* Price section */}
          <div className="pt-4">
            <p className="text-2xl font-semibold">
              {formatPrice(selectedProduce.price.nominal)}/{selectedProduce.price.unit}
            </p>
          </div>
        </div>

        {/* Quantity selector - with input instead of just buttons */}
        <div className="flex flex-col space-y-2 pt-4">
          <p className="font-medium">Quantity ({selectedProduce.price.unit})</p>
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
            {formatPrice(selectedProduce.price.nominal * quantity)}
          </p>
        </div>

        {/* Add to cart button */}
        <div className="grid grid-cols-1 pt-6 gap-4">
          <Button onClick={handleAddToCart} disabled={isLoading} className="w-full">
            {isLoading ? 'Adding...' : 'Add to cart'}
          </Button>
        </div>

        {/* Contact information */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Contact Farmer</h2>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Phone:</p>
              <p>{farmer.contact.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">WhatsApp:</p>
              <p>{farmer.contact.whatsapp}</p>
            </div>
          </div>
        </div>

        {/* Location information */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Farm Location</h2>
          </div>
          <Separator />
          <div className="prose prose-sm max-w-none">
            <p>{farmer.location.address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
