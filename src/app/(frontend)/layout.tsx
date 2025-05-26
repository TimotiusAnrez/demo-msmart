import React from 'react'
import '@/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

export const metadata = {
  description:
    'Public Service Platform for local tourism, business, agriculture, procurement, public service and more in Manggarai Barat',
  title: 'MSmart',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="w-screen min-h-screen">
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
