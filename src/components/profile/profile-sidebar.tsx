'use client'

import { User, ShoppingCart, FileText, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'

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
import { Button } from '../ui/button'

const profileNavItems = [
  {
    title: 'Profile',
    url: '/profile',
    icon: User,
  },
  {
    title: 'Cart',
    url: '/profile/cart',
    icon: ShoppingCart,
  },
  {
    title: 'Agri Cart',
    url: '/profile/agriCart',
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
        <div className="flex items-center gap-2 px-2 py-1 hover:cursor-pointer">
          <Link href={'/'} className="hover:cursor-pointer">
            <Button variant="ghost" className="hover:cursor-pointer">
              MSmart
            </Button>
          </Link>
        </div>
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
