'use client'

import Link from 'next/link'
import { Header } from '@/payload-types'

interface DesktopNavProps {
  headerConfig: Header
}

export function DesktopNav({ headerConfig }: DesktopNavProps) {
  // Helper function to render menu groups
  const renderMenuItems = (items: any[] = []) => {
    return items.map((item, index) => (
      <Link
        key={`${item.label}-${index}`}
        href={`/page/${item.page?.slug || '#'}`}
        className="text-gray-700 hover:text-primary/50 transition-colors"
      >
        {item.label}
      </Link>
    ))
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {/* Tourism Menu Items */}
      {headerConfig?.menu && renderMenuItems(headerConfig.menu)}

      {/* Service Menu Items */}
      {headerConfig?.service && renderMenuItems(headerConfig.service)}

      {/* Agriculture Menu Items */}
      {headerConfig?.agriculture && renderMenuItems(headerConfig.agriculture)}
    </nav>
  )
}
