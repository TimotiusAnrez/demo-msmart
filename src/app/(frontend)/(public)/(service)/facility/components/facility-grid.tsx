import { Facility } from '@/payload-types'
import { FacilityCard } from './facility-card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

interface FacilityGridProps {
  facilities: Facility[]
}

export function FacilityGrid({ facilities }: FacilityGridProps) {
  // Handle empty state
  if (facilities.length === 0) {
    return (
      <Alert className="bg-muted/50 border-none">
        <Info className="h-4 w-4" />
        <AlertTitle>No facilities found</AlertTitle>
        <AlertDescription>
          Try adjusting your search or filters to find facilities.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility) => (
        <FacilityCard key={facility.id} facility={facility} />
      ))}
    </div>
  )
}
