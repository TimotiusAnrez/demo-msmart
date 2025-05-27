'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth, useUser } from '@clerk/nextjs'
import { Menu, MapPin, Globe, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Header, Media } from '@/payload-types'

// Desktop Navigation component
import { DesktopNav } from '@/components/global/header/desktop-nav'
// Mobile Navigation component
import { MobileNav } from '@/components/global/header/mobile-nav'

interface ClientHeaderProps {
  headerConfig: Header
}

export function ClientHeader({ headerConfig }: ClientHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isSignedIn } = useUser()

  // Logo rendering
  const renderLogo = () => {
    return (
      <Link href="/" className="flex items-center space-x-2">
        {headerConfig?.logo ? (
          <Image
            src={(headerConfig.logo as Media).url || ''}
            alt="MSmart Logo"
            width={40}
            height={40}
            className="h-8 w-auto"
          />
        ) : (
          <MapPin className="h-8 w-8 text-primary/50" />
        )}
        <span className="text-xl font-bold text-gray-900">MSmart</span>
      </Link>
    )
  }

  // User profile section
  const renderUserSection = () => {
    if (isSignedIn && user) {
      return (
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-primary/70 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-primary/80 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
          <Link href="/profile" className="flex items-center space-x-2">
            <Avatar>
              {user.hasImage ? (
                <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
              ) : (
                <AvatarFallback>
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
        </div>
      )
    }

    return (
      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          EN
        </Button>
        <div className="auth-button flex items-center space-x-2">
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
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      {renderLogo()}

      {/* Desktop Navigation */}
      <DesktopNav headerConfig={headerConfig} />

      {/* Right side buttons */}
      {renderUserSection()}

      {/* Mobile menu button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <MobileNav headerConfig={headerConfig} isSignedIn={isSignedIn} user={user} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
