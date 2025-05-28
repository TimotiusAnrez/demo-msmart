import Image from 'next/image'
import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'

import { NavigationLink } from '@/types/globals.enum'
import { PublicNavigation } from './public-navigation'
import { UserNavigation } from './user-navigation'
import { MobileNav } from './mobile-nav'

export async function Header() {
  const user = await currentUser()

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center bg-neutral-50 py-2">
      <div className="container flex h-16 items-center justify-between bg-neutral-50 p-4 rounded-md">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <h3 className="hidden text-xl font-bold sm:inline-block">MSmart</h3>
          </Link>

          {/* Public Navigation */}
          <div className="hidden md:block">
            <PublicNavigation />
          </div>
        </div>

        {/* Right Side - User Navigation */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <UserNavigation />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
