'use client'
import { AdvancedMarker, APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

export function MapDialog() {
  const position = { lat: -8.489874643703128, lng: 119.88328199178368 }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API || ''}>
      <Map defaultCenter={position} defaultZoom={15} className="w-96 h-96" mapId={'MSMART_DEV_ID '}>
        <AdvancedMarker position={position} />
      </Map>
    </APIProvider>
  )
}
