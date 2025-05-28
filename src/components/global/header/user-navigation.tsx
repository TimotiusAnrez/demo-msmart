'use client'

import Link from 'next/link'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { ShoppingCart, User as UserIcon } from 'lucide-react'

import { NavigationLink, PrivateNavigationLink } from '@/types/globals.enum'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserNavigation() {
  const user = useUser()

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm">Create Account</Button>
        </SignUpButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {/* Cart */}
      <Button variant="ghost" size="icon" asChild>
        <Link href={PrivateNavigationLink.CART}>
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Shopping cart</span>
        </Link>
      </Button>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.user?.primaryEmailAddress?.emailAddress.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-xs leading-none text-muted-foreground">
                {user.user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={PrivateNavigationLink.PROFILE}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={PrivateNavigationLink.CART}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>My Cart</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => (window.location.href = '/user/sign-out')}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
