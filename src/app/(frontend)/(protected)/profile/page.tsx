import { ProfileHeader } from '@/components/frontend/profile/profile-header'
import { ProfilePageClient } from '@/components/frontend/profile/profile-page-client'
import { RedirectToSignUp } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) return <RedirectToSignUp />

  const payload = await getPayload({ config })

  const userPayload = await payload.find({
    collection: 'users',
    where: {
      clerkID: {
        equals: user.id,
      },
    },
  })

  if (!userPayload) return <RedirectToSignUp />

  const userData = userPayload.docs[0]

  return (
    <div className="flex flex-col h-full">
      <ProfileHeader title="Profile" />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <ProfilePageClient initialUser={userData} />
        </div>
      </div>
    </div>
  )
}
