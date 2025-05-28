'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User } from '@clerk/nextjs/server'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { Menu, ShoppingCart, ChevronDown } from 'lucide-react'

import { NavigationLink, PrivateNavigationLink } from '@/types/globals.enum'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [tourismOpen, setTourismOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  const user = useUser()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px] pt-10">
        <div className="flex flex-col gap-6">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-3">
            {/* Tourism Dropdown */}
            <Collapsible open={tourismOpen} onOpenChange={setTourismOpen} className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between">
                  <span>Tourism</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      tourismOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 flex flex-col space-y-2 mt-1">
                <Link
                  href={NavigationLink.ACTIVITY}
                  className="py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Activity
                </Link>
                <Link
                  href={NavigationLink.DESTINATIONS}
                  className="py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Destinations
                </Link>
                <Link href={NavigationLink.FNB} className="py-2" onClick={() => setIsOpen(false)}>
                  Food & Beverage
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* Shopping Direct Link */}
            <Link
              href={NavigationLink.SHOPPING}
              className="px-4 py-2"
              onClick={() => setIsOpen(false)}
            >
              Shopping
            </Link>

            {/* Agriculture Direct Link */}
            <Link
              href={NavigationLink.AGRICULTURE}
              className="px-4 py-2"
              onClick={() => setIsOpen(false)}
            >
              Agriculture
            </Link>

            {/* Services Dropdown */}
            <Collapsible open={servicesOpen} onOpenChange={setServicesOpen} className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between">
                  <span>Services</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      servicesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 flex flex-col space-y-2 mt-1">
                <Link
                  href={NavigationLink.DISCUSSION}
                  className="py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Discussion
                </Link>
                <Link
                  href={NavigationLink.FACILITY}
                  className="py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Facility
                </Link>
                <Link
                  href={NavigationLink.REPORT}
                  className="py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Report
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* News Direct Link */}
            <Link href={NavigationLink.NEWS} className="px-4 py-2" onClick={() => setIsOpen(false)}>
              News
            </Link>
          </div>

          {/* Auth Section */}
          <div className="border-t pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.user?.primaryEmailAddress?.emailAddress.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {user.user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Link
                    href={PrivateNavigationLink.PROFILE}
                    className="px-4 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={PrivateNavigationLink.CART}
                    className="flex items-center gap-2 px-4 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>My Cart</span>
                  </Link>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      window.location.href = '/user/sign-out'
                      setIsOpen(false)
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full" onClick={() => setIsOpen(false)}>
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
