import { checkRole } from '@/helper/checkRoleHelper'
import { User } from '@/payload-types'
import { Access } from 'payload'

export const userSelfCollectionAccess: Access = ({ req }) => {
  const enableRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [
    'ADMIN_MS',
    'ADMIN_MSAGRI',
    'SUPER_ADMIN',
  ]

  const userRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [
    'USER',
    'USER_BUSINESS',
  ]

  if (checkRole(enableRole, req.user as User)) {
    return true
  } else if (checkRole(userRole, req.user as User)) {
    return {
      id: { equals: req.user?.id },
    }
  }

  return false
}
