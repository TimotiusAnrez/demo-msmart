import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { ClerkNavigationLink, NavigationLink } from './types/globals.enum'
import { NextRequest, NextResponse } from 'next/server'
import { checkRolePublic } from './helper/checkRoleHelper'

/**
 * Level of clerk protection
 * 
 * 1. Public routes (no protection)
 * 2. Protected routes (require clerk userId)
 * 3. Onboarding Complete / data saved to payload (require clerk userID, onboarding complete)
 * 4. Verified User Routes (require clerk userId, onboarding complete, private meta verified)
 * 5. Admin Routes (require clerk userId, admin role)
 * 
 * clerk metadata
 * 
 * public: {
 *  onboardingComplete?: boolean
 *  verificationStatus: 'UNVERIFIED' | 'VERIFICATION_REQUEST' | 'DECLINED' | 'VERIFIED'
 *  isSuspended: boolean
 * }
 * 
 * private:{
 *  payloadID: number //payload user id
 *  role: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[]
      
 * }
 */

const isPublicRoute = createRouteMatcher([
  ClerkNavigationLink.SIGN_IN,
  ClerkNavigationLink.SIGN_UP,
  NavigationLink.HOME,
])

const isOnboardingRoute = createRouteMatcher([NavigationLink.ONBOARDING])

const isProtectedRoute = createRouteMatcher([
  ClerkNavigationLink.PROFILE,
  ClerkNavigationLink.ADMIN,
  NavigationLink.ONBOARDING,
])

const isNeedOnboardingRoute = createRouteMatcher([
  ClerkNavigationLink.ADMIN,
  ClerkNavigationLink.PROFILE,
])

const isAdminRoute = createRouteMatcher([ClerkNavigationLink.ADMIN])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  if (isProtectedRoute(req)) {
    if (!userId) return redirectToSignIn({ returnBackUrl: req.url })

    //going to onboarding via manually but have complete the onboarding will redirect to profile
    if (isOnboardingRoute(req) && sessionClaims.metadata.onboardingComplete) {
      return NextResponse.redirect(new URL(NavigationLink.PROFILE, req.url))
    }

    //authed but onboarding not complete but going to route need onboarding
    if (isNeedOnboardingRoute(req) && !sessionClaims.metadata.onboardingComplete) {
      const onboardingUrl = NavigationLink.ONBOARDING
      return NextResponse.redirect(new URL(onboardingUrl, req.url))
    }

    //authed, onboarding complete, but going to admin specific route hence check the role
    if (isAdminRoute(req) && userId && sessionClaims.metadata.onboardingComplete) {
      const client = await clerkClient()
      const response = await client.users.getUser(userId)

      if (!response) return redirectToSignIn({ returnBackUrl: NavigationLink.PROFILE })

      //retrive the role and widen the type
      const role = response.privateMetadata.role as (
        | 'USER'
        | 'USER_BUSINESS'
        | 'ADMIN_MS'
        | 'ADMIN_MSAGRI'
        | 'SUPER_ADMIN'
      )[]

      //check if role exist
      if (!role || role.length < 1)
        return redirectToSignIn({ returnBackUrl: NavigationLink.PROFILE })

      //if true let them pass
      if (checkRolePublic(['USER_BUSINESS', 'ADMIN_MS', 'ADMIN_MSAGRI', 'SUPER_ADMIN'], role)) {
        return NextResponse.next()
      }

      //if false redirect to profile
      return NextResponse.redirect(new URL(NavigationLink.PROFILE, req.url))
    }

    //authed but not going to need onboarding route
    return NextResponse.next()
  }

  if (isPublicRoute(req)) {
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
