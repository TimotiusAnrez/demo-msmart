import { Button } from '@/components/ui/button'
import { NavigationLink } from '@/types/globals.enum'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

function RedirectToOnboardingPage() {
  return (
    <div className="w-screen h-screen absolute flex items-center justify-center">
      <h1>Uh Oh! you haven't complete your profile yet</h1>
      <h3>Let's complete your profile</h3>
      <Button>Go to Onboarding</Button>
    </div>
  )
}

export default async function ProfilePage() {
  const user = await currentUser()

  //precaution in case middleware fail
  if (!user) {
    redirect(NavigationLink.SIGN_IN)
  }

  //if onboarding not complete
  if (
    !user?.publicMetadata.onboardingComplete ||
    user.publicMetadata.onboardingComplete === false
  ) {
    redirect(NavigationLink.ONBOARDING)
  }

  return (
    <div>
      <h1>Profile</h1>
    </div>
  )
}
