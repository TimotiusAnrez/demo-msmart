'use client'
import React, { FormEvent, useCallback, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useAutocompleteSuggestions } from '@/hooks/use-autocomplete'
import { useDebounce } from 'use-debounce'
import { Input } from '../ui/input'
import { Command, CommandInput, CommandItem, CommandList } from '../ui/command'

interface AutoCompleteProps {}

export function MapAutoComplete() {
  const place = useMapsLibrary('places')
  const geoCode = useMapsLibrary('geocoding')

  const [inputValue, setInputValue] = useState<string>('')
  const [debounceValue] = useDebounce(inputValue, 500)
  const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(debounceValue)
  //need fixing when user select command item it will trace the geocode update the geocode, and pass the geocode to map component to re render
  const handleSelect = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!place || !geoCode || inputValue.length === 0) return

      const placeGeocode = geoCode?.Geocoder
    },
    [],
  )

  return (
    <div className="autoCompleteContainer">
      <Command>
        <CommandInput
          placeholder="Search places"
          value={inputValue}
          onValueChange={setInputValue}
        />
        <CommandList>
          {isLoading ? (
            <CommandItem>Searching...</CommandItem>
          ) : (
            suggestions.map((suggestion) => {
              if (!suggestion.placePrediction) return

              return (
                <CommandItem
                  key={suggestion.placePrediction.placeId}
                  onSelect={() => {
                    setInputValue(suggestion.placePrediction?.text?.text ?? '')
                    resetSession()
                  }}
                >
                  {suggestion.placePrediction.text.text}
                </CommandItem>
              )
            })
          )}
        </CommandList>
      </Command>
    </div>
  )
}
