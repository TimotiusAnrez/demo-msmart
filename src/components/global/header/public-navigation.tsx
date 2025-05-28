'use client'

import Link from 'next/link'
import { NavigationLink } from '@/types/globals.enum'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Image from 'next/image'
import { useState } from 'react'

export function PublicNavigation() {
  const imageList = {
    destination:
      'https://images.unsplash.com/photo-1602989988967-6d763203bcbf?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    activity:
      'https://images.unsplash.com/photo-1682687982502-1529b3b33f85?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    fnb: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  }
  const [image, setImage] = useState<string>(imageList.destination)

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Tourism Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tourism</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ul className="grid gap-2">
                <li
                  onMouseEnter={() => setImage(imageList.destination)}
                  onMouseLeave={() => setImage(imageList.destination)}
                >
                  <NavigationMenuLink asChild>
                    <Link
                      href={NavigationLink.DESTINATIONS}
                      className="block p-3 space-y-1 rounded-md hover:bg-accent"
                    >
                      <div className="font-medium leading-none">Destinations</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                        Explore beautiful destinations and attractions
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li
                  onMouseEnter={() => setImage(imageList.activity)}
                  onMouseLeave={() => setImage(imageList.activity)}
                >
                  <NavigationMenuLink asChild>
                    <Link
                      href={NavigationLink.ACTIVITY}
                      className="block p-3 space-y-1 rounded-md hover:bg-accent"
                    >
                      <div className="font-medium leading-none">Activities</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                        Discover exciting activities and adventures
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>

                <li
                  onMouseEnter={() => setImage(imageList.fnb)}
                  onMouseLeave={() => setImage(imageList.fnb)}
                >
                  <NavigationMenuLink asChild>
                    <Link
                      href={NavigationLink.FNB}
                      className="block p-3 space-y-1 rounded-md hover:bg-accent"
                    >
                      <div className="font-medium leading-none">Food & Beverage</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                        Find local restaurants and culinary experiences
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
              <div className="w-[250px] h-[300px]">
                <Image
                  src={image}
                  alt=""
                  width={500}
                  height={500}
                  className="w-full h-full object-cover object-center rounded-md"
                />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Shopping - Direct Link */}
        <NavigationMenuItem>
          <Link href={NavigationLink.SHOPPING} passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Shopping
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Agriculture - Direct Link */}
        <NavigationMenuItem>
          <Link href={NavigationLink.AGRICULTURE} passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Agriculture
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Services Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <ul className="grid gap-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href={NavigationLink.DISCUSSION}
                      className="block p-3 space-y-1 rounded-md hover:bg-accent"
                    >
                      <div className="font-medium leading-none">Discussion</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                        Join community discussions and forums
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href={NavigationLink.FACILITY}
                      className="block p-3 space-y-1 rounded-md hover:bg-accent"
                    >
                      <div className="font-medium leading-none">Facility</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                        Find public facilities and amenities
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href={NavigationLink.REPORT}
                      className="block p-3 space-y-1 rounded-md hover:bg-accent"
                    >
                      <div className="font-medium leading-none">Report</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                        Report issues or provide feedback
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* News - Direct Link */}
        <NavigationMenuItem>
          <Link href={NavigationLink.NEWS} passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>News</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
