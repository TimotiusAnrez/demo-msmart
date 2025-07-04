import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Map, X } from 'lucide-react'
import { MapWithAdvanceMarker } from './map'

interface MapDrawerProps {
  title?: string
  position: { lat: number; lng: number }[]
  defaultCenter?: { lat: number; lng: number } | null
}

export default function MapDrawer({ title, position, defaultCenter }: MapDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          <Map className="w-4 h-4 mr-2" /> Open Map
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title || 'Map'}</DrawerTitle>
        </DrawerHeader>
        <MapWithAdvanceMarker positionList={position} defaultCenter={defaultCenter} />
      </DrawerContent>
    </Drawer>
  )
}
