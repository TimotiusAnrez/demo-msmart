import { checkRole } from '@/helper/checkRoleHelper'
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import {
  AuthStrategy,
  AuthStrategyFunctionArgs,
  AuthStrategyResult,
  User,
  type Payload,
} from 'payload'

export async function getUser({ payload }: { payload: Payload }): Promise<User | null> {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    const allowedRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] =
      ['USER_BUSINESS', 'ADMIN_MS', 'ADMIN_MSAGRI', 'SUPER_ADMIN']

    if (!userId || !user) {
      return null
    }
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)

    if (!clerkUser.privateMetadata.payloadID) {
      return null
    }

    const userQuery = await payload.findByID({
      collection: 'users',
      id: clerkUser.privateMetadata.payloadID as number,
    })

    if (!userQuery) return null

    //if role checked
    if (checkRole(allowedRole, userQuery))
      return {
        collection: 'users',
        ...userQuery,
      }

    //fail check role
    return null
  } catch (error) {
    console.log(error)

    return null
  }
}

async function authenticate({ payload }: AuthStrategyFunctionArgs): Promise<AuthStrategyResult> {
  const user = await getUser({ payload })

  if (!user) {
    return { user: null }
  }

  return {
    user,
  }
}

export const ClerkAuthStrategy: AuthStrategy = {
  name: 'clerk-auth-strategy',
  authenticate,
}
