import FormExample from '@/components/form/form-example'
import UserOnboardingForm from '@/components/frontend/onboarding/userForm'
import { NavigationLink } from '@/types/globals.enum'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user?.id) {
    redirect(NavigationLink.SIGN_IN)
  }

  return (
    <UserOnboardingForm
      clerkID={user.id}
      email={user.primaryEmailAddress?.emailAddress}
      firstName={user?.firstName}
      lastName={user?.lastName}
    />
  )
}
