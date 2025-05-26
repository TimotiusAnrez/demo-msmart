import { NavigationLink } from '@/types/globals.enum'
import Link from 'next/link'
import { Button } from 'react-day-picker'

export default function AdminSignIn() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Link href={NavigationLink.PROFILE}>
        <Button>Back to Profile</Button>
      </Link>
    </div>
  )
}
