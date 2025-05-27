'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { ShoppingCart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/payload-types'
import { User } from '@clerk/nextjs/server'

interface MobileNavProps {
  headerConfig: Header
  isSignedIn?: boolean
  user?: User | null
}

export function MobileNav({ headerConfig, isSignedIn, user }: MobileNavProps) {
  // Helper function to render menu groups
  const renderMenuItems = (items: any[] = [], title: string) => {
    if (!items || items.length === 0) return null

    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        {items.map((item, index) => (
          <Link
            key={`${item.label}-${index}`}
            href={`/page/${item.page?.slug || '#'}`}
            className="block py-2 text-lg font-medium"
          >
            {item.label}
          </Link>
        ))}
      </div>
    )
  }

  // User section for mobile
  const renderUserSection = () => {
    if (isSignedIn && user) {
      return (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarFallback>{user.primaryEmailAddress?.emailAddress.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.primaryEmailAddress?.emailAddress}</p>
              <Link href="/profile" className="text-sm text-primary/80">
                View Profile
              </Link>
            </div>
          </div>
          <Link href="/cart" className="flex items-center space-x-2 py-2 mb-2">
            <ShoppingCart className="h-5 w-5" />
            <span>My Cart</span>
          </Link>
        </div>
      )
    }

    return (
      <div className="border-t pt-4 mt-4">
        <SignInButton>
          <Button variant="ghost" className="w-full justify-start mb-2">
            Login
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button className="w-full bg-primary/80 hover:bg-primary">Sign Up</Button>
        </SignUpButton>
      </div>
    )
  }

  return (
    <nav className="flex flex-col mt-8">
      {/* Tourism Menu Items */}
      {renderMenuItems(headerConfig?.menu || [], 'Tourism')}

      {/* Service Menu Items */}
      {renderMenuItems(headerConfig?.service || [], 'Services')}

      {/* Agriculture Menu Items */}
      {renderMenuItems(headerConfig?.agriculture || [], 'Agriculture')}

      {/* User Section */}
      {renderUserSection()}
    </nav>
  )
}
