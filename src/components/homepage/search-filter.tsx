'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, MapPin, CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// Define our schema for each tab
const destinationSearchSchema = z.object({
  destination: z.string().min(1, 'Please enter a destination'),
  category: z.string().optional(),
})

const activitySearchSchema = z.object({
  activity: z.string().min(1, 'Please enter an activity'),
  date: z.date().optional(),
})

const restaurantSearchSchema = z.object({
  restaurant: z.string().min(1, 'Please enter a restaurant name'),
  date: z.date().optional(),
})

type DestinationSearchValues = z.infer<typeof destinationSearchSchema>
type ActivitySearchValues = z.infer<typeof activitySearchSchema>
type RestaurantSearchValues = z.infer<typeof restaurantSearchSchema>

export function SearchFilter() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('destination')

  // Initialize forms for each tab
  const destinationForm = useForm<DestinationSearchValues>({
    resolver: zodResolver(destinationSearchSchema),
    defaultValues: {
      destination: '',
      category: '',
    },
  })

  const activityForm = useForm<ActivitySearchValues>({
    resolver: zodResolver(activitySearchSchema),
    defaultValues: {
      activity: '',
    },
  })

  const restaurantForm = useForm<RestaurantSearchValues>({
    resolver: zodResolver(restaurantSearchSchema),
    defaultValues: {
      restaurant: '',
    },
  })

  // Form submission handlers
  const onDestinationSubmit = (data: DestinationSearchValues) => {
    const searchParams = new URLSearchParams()
    searchParams.append('query', data.destination)
    if (data.category) searchParams.append('category', data.category)

    router.push(`/destinations?${searchParams.toString()}`)
  }

  const onActivitySubmit = (data: ActivitySearchValues) => {
    const searchParams = new URLSearchParams()
    searchParams.append('query', data.activity)
    if (data.date) searchParams.append('date', data.date.toISOString())

    router.push(`/activity?${searchParams.toString()}`)
  }

  const onRestaurantSubmit = (data: RestaurantSearchValues) => {
    const searchParams = new URLSearchParams()
    searchParams.append('query', data.restaurant)
    if (data.date) searchParams.append('date', data.date.toISOString())

    router.push(`/fnb?${searchParams.toString()}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 -mt-8 relative z-10">
      <Tabs defaultValue="destination" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="destination">
            <MapPin className="mr-2 h-4 w-4" />
            Destinations
          </TabsTrigger>
          <TabsTrigger value="activity">
            <MapPin className="mr-2 h-4 w-4" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="restaurant">
            <MapPin className="mr-2 h-4 w-4" />
            Restaurants
          </TabsTrigger>
        </TabsList>

        {/* Destination Search Tab */}
        <TabsContent value="destination">
          <Form {...destinationForm}>
            <form
              onSubmit={destinationForm.handleSubmit(onDestinationSubmit)}
              className="flex gap-4"
            >
              <FormField
                control={destinationForm.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search destinations..." className="pl-10" {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="px-6">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* Activity Search Tab */}
        <TabsContent value="activity">
          <Form {...activityForm}>
            <form onSubmit={activityForm.handleSubmit(onActivitySubmit)} className="flex gap-4">
              <FormField
                control={activityForm.control}
                name="activity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Search activities..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={activityForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <Button type="submit" className="px-6">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* Restaurant Search Tab */}
        <TabsContent value="restaurant">
          <Form {...restaurantForm}>
            <form onSubmit={restaurantForm.handleSubmit(onRestaurantSubmit)} className="flex gap-4">
              <FormField
                control={restaurantForm.control}
                name="restaurant"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Search restaurants..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={restaurantForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <Button type="submit" className="px-6">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
