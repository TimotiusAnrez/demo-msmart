import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Building,
  Shield,
  Users,
} from 'lucide-react'

import { Header } from '@/components/global/header/header'
import { getPayloadClient } from '@/lib/payload/payload-client'
import { Facility, Media } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import MapDrawer from '@/components/map/mapSheet'
import { DefaultAssets } from '@/types/globals.enum'

interface FacilityDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for the page
export async function generateMetadata({ params }: FacilityDetailPageProps): Promise<Metadata> {
  const payload = await getPayloadClient()
  const { id } = await params

  try {
    const facility = (await payload.findByID({
      collection: 'facility',
      id,
      depth: 2,
    })) as Facility

    return {
      title: `${facility.name} | Facility Details`,
      description: facility.description,
    }
  } catch (error) {
    return {
      title: 'Facility Not Found',
      description: 'The requested facility could not be found.',
    }
  }
}

export default async function FacilityDetailPage({ params }: FacilityDetailPageProps) {
  const { id } = await params
  const payload = await getPayloadClient()

  // Fetch the facility by ID
  let facility: Facility
  try {
    facility = (await payload.findByID({
      collection: 'facility',
      id,
      depth: 2, // Get nested data like media
    })) as Facility
  } catch (error) {
    notFound()
  }

  const { name, description, type, sector, location, contactList, logo } = facility
  const logoData = logo as Media
  const logoUrl = logoData?.url || DefaultAssets.PRODUCT

  // Prepare position data for map
  const facilityPosition = [
    {
      lat: location.geo[0],
      lng: location.geo[1],
    },
  ]

  // Helper function to get contact icon
  const getContactIcon = (contactType: string) => {
    switch (contactType) {
      case 'PHONE':
        return <Phone className="h-4 w-4" />
      case 'EMAIL':
        return <Mail className="h-4 w-4" />
      case 'WHATSAPP':
        return <MessageSquare className="h-4 w-4" />
      case 'WEBSITE':
        return <Globe className="h-4 w-4" />
      default:
        return <Phone className="h-4 w-4" />
    }
  }

  // Helper function to get sector icon
  const getSectorIcon = (sectorType: string) => {
    switch (sectorType) {
      case 'HEALTH':
        return '🏥'
      case 'EDUCATION':
        return '🎓'
      case 'GOVERNMENT':
        return '🏛️'
      case 'PUBLIC_SERVICE':
        return '🏛️'
      case 'INFRASTRUCTURE':
        return '🏗️'
      default:
        return '🏢'
    }
  }

  // Helper function to format contact value
  const formatContactValue = (contactType: string, value: string) => {
    switch (contactType) {
      case 'PHONE':
      case 'WHATSAPP':
        return value.startsWith('+') ? value : `+62${value.replace(/^0/, '')}`
      case 'EMAIL':
        return value
      case 'WEBSITE':
        return value.startsWith('http') ? value : `https://${value}`
      default:
        return value
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/facility"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Facilities
          </Link>
        </div>

        {/* Facility Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 96px, 128px"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={type === 'PUBLIC' ? 'default' : 'secondary'}>
                      {type === 'PUBLIC' ? (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Public Facility
                        </>
                      ) : (
                        <>
                          <Building className="w-3 h-3 mr-1" />
                          Private Facility
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline">
                      <span className="mr-1">{getSectorIcon(sector)}</span>
                      {sector
                        .replace('_', ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{location.address}</span>
                  </div>
                </div>

                {/* Map Button */}
                <MapDrawer
                  title={`${name} Location`}
                  position={facilityPosition}
                  defaultCenter={facilityPosition[0]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  About This Facility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                  <p className="text-gray-600">{location.address}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Coordinates</h4>
                  <p className="text-gray-600 font-mono text-sm">
                    {location.geo[0].toFixed(6)}, {location.geo[1].toFixed(6)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            {contactList && contactList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactList.map((contact, index) => (
                    <div key={contact.id || index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getContactIcon(contact.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {contact.type.toLowerCase()}
                        </p>
                        <div className="text-sm text-gray-600">
                          {contact.type === 'WEBSITE' ? (
                            <a
                              href={formatContactValue(contact.type, contact.value)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {contact.value}
                            </a>
                          ) : contact.type === 'EMAIL' ? (
                            <a
                              href={`mailto:${contact.value}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {contact.value}
                            </a>
                          ) : contact.type === 'WHATSAPP' ? (
                            <a
                              href={`https://wa.me/${formatContactValue(contact.type, contact.value).replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800"
                            >
                              {formatContactValue(contact.type, contact.value)}
                            </a>
                          ) : (
                            <a
                              href={`tel:${formatContactValue(contact.type, contact.value)}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {formatContactValue(contact.type, contact.value)}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Type</span>
                  <Badge variant={type === 'PUBLIC' ? 'default' : 'secondary'}>{type}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Sector</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {sector
                      .replace('_', ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
