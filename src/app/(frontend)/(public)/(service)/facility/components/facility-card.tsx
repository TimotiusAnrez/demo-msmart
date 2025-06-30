import Link from 'next/link'
import Image from 'next/image'
import { Facility, Media } from '@/payload-types'
import { Building2, MapPin, Phone, Mail, Globe, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { DefaultAssets } from '@/types/globals.enum'

interface FacilityCardProps {
  facility: Facility
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const { id, name, logo, type, sector, description, location, contactList } = facility

  // Extract logo image if available
  const logoImage = logo as Media

  // Find the primary contact methods
  const email = contactList?.find((contact) => contact.type === 'EMAIL')?.value
  const phone = contactList?.find((contact) => contact.type === 'PHONE')?.value
  const website = contactList?.find((contact) => contact.type === 'WEBSITE')?.value

  // Format sector text for display
  const sectorText = sector
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <Card className="overflow-hidden flex flex-col h-full p-0">
      {/* Card Header with Logo */}
      <div className="h-48 bg-muted/30 relative flex items-center justify-center p-6">
        {logoImage && logoImage.url ? (
          <Image
            src={logoImage.url || DefaultAssets.PRODUCT}
            alt={name}
            width={200}
            height={150}
            className="object-contain h-full w-auto"
          />
        ) : (
          <Building2 className="w-16 h-16 text-muted-foreground opacity-50" />
        )}
      </div>

      {/* Card Content */}
      <CardContent className="flex-grow pt-6 space-y-4">
        <div className="space-y-2">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={type === 'PUBLIC' ? 'default' : 'outline'}>{type}</Badge>
            <Badge variant="secondary">{sectorText}</Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-xl">{name}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>

        {/* Location */}
        {location && (
          <div className="flex gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            <p className="text-sm">{location.address}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate">{email}</span>
            </div>
          )}

          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{phone}</span>
            </div>
          )}

          {website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate">{website}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Card Actions */}
      <CardFooter className="border-t bg-muted/10 pt-4 pb-4">
        <div className="flex gap-2 w-full">
          <Button variant="default" className="w-full" asChild size="sm">
            <Link href={`/facility/${id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
