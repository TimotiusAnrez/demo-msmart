import type React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { ProfileSidebar } from '@/components/frontend/profile/profile-sidebar'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProfileSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
