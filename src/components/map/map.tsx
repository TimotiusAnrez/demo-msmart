'use client'
import { AdvancedMarker, APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

interface MapWithAdvanceMarkerProps {
  defaultCenter?: { lat: number; lng: number } | null
  positionList: { lat: number; lng: number }[]
}

export function MapWithAdvanceMarker({ defaultCenter, positionList }: MapWithAdvanceMarkerProps) {
  const defaultPoint = defaultCenter
    ? defaultCenter
    : { lat: -8.49756912540759, lng: 119.89093370219004 }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API || ''}>
      <Map
        defaultCenter={defaultPoint}
        defaultZoom={15}
        className="w-screen h-screen"
        mapId={'MSMART_DEV_ID '}
      >
        {positionList.map((position, index) => (
          <AdvancedMarker key={index} position={position} />
        ))}
      </Map>
    </APIProvider>
  )
}
