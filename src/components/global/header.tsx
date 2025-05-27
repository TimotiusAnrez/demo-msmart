'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, MapPin, Globe } from 'lucide-react'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback } from '../ui/avatar'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary/50" />
            <span className="text-xl font-bold text-gray-900">MSmart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary/50 transition-colors">
              Home
            </Link>
            <Link
              href="/destinations"
              className="text-gray-700 hover:text-primary/50 transition-colors"
            >
              Destinations
            </Link>
            <Link href="/hotels" className="text-gray-700 hover:text-primary/50 transition-colors">
              Hotels
            </Link>
            <Link
              href="/restaurants"
              className="text-gray-700 hover:text-primary/50 transition-colors"
            >
              Restaurants
            </Link>
            <Link
              href="/businesses"
              className="text-gray-700 hover:text-primary/50 transition-colors"
            >
              Local Business
            </Link>
            <Link
              href="/travel-planner"
              className="text-gray-700 hover:text-primary/50 transition-colors"
            >
              Travel Planner
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              EN
            </Button>
            {user ? (
              <Avatar>
                <AvatarFallback>{user.primaryEmailAddress?.emailAddress?.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="auth-button">
                <SignInButton>
                  <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="bg-primary/80 hover:bg-primary hover:cursor-pointer">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/destinations" className="text-lg font-medium">
                  Destinations
                </Link>
                <Link href="/hotels" className="text-lg font-medium">
                  Hotels
                </Link>
                <Link href="/restaurants" className="text-lg font-medium">
                  Restaurants
                </Link>
                <Link href="/businesses" className="text-lg font-medium">
                  Local Business
                </Link>
                <Link href="/travel-planner" className="text-lg font-medium">
                  Travel Planner
                </Link>
                <div className="pt-4 border-t">
                  <Button variant="ghost" className="w-full justify-start mb-2">
                    Login
                  </Button>
                  <Button className="w-full bg-primary/80 hover:bg-primary">Sign Up</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
