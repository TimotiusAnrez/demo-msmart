import { checkRole } from '@/helper/checkRoleHelper'
import { User } from '@/payload-types'
import { Access, FieldAccess } from 'payload'

export const adminOnlyFieldAccess: FieldAccess = ({ req }) => {
  const enableRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [
    'ADMIN_MS',
    'SUPER_ADMIN',
  ]

  if (checkRole(enableRole, req.user as User)) {
    return true
  }

  return false
}

export const adminOnlyCollectionAccess: Access = ({ req }) => {
  const enableRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [
    'ADMIN_MS',
    'SUPER_ADMIN',
  ]

  if (checkRole(enableRole, req.user as User)) {
    return true
  }

  return false
}
