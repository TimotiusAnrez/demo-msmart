import { checkRole } from '@/helper/checkRoleHelper'
import { User } from '@/payload-types'
import { Access, FieldAccess } from 'payload'

export const userOnlyFieldAccess: FieldAccess = ({ req }) => {
  const enableRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [
    'USER',
    'USER_BUSINESS',
  ]

  if (checkRole(enableRole, req.user as User)) {
    return true
  }

  return false
}

export const userOnlyCollectionAccess: Access = ({ req }) => {
  const enableRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [
    'USER',
    'USER_BUSINESS',
  ]

  if (checkRole(enableRole, req.user as User)) {
    return true
  }

  return false
}
