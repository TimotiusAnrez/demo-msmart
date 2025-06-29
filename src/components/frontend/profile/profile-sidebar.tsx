'use client'

import { User, ShoppingCart, FileText, MessageSquare, Settings, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { NavigationLink } from '@/types/globals.enum'

const profileNavItems = [
  {
    title: 'Profile',
    url: '/profile',
    icon: User,
  },
  {
    title: 'Agri Cart',
    url: '/profile/agriCart',
    icon: ShoppingBag,
  },
  {
    title: 'Cart',
    url: '/profile/cart',
    icon: ShoppingCart,
  },
  {
    title: 'Reports',
    url: '/profile/reports',
    icon: FileText,
  },
  {
    title: 'Discussion',
    url: '/profile/discussion',
    icon: MessageSquare,
  },
]

export function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={NavigationLink.HOME}>
          <div className="flex items-center gap-2 px-2 py-1">
            <h3 className="font-semibold">MSmart</h3>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SidebarContent>
    </Sidebar>
  )
}
