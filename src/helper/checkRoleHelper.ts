import type { User } from '@/payload-types'

export const checkRole = (
  allRoles: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [],
  user: User,
): boolean => {
  if (user) {
    if (
      allRoles?.some((role) => {
        return user?.role?.some((individualRole) => {
          return individualRole === role
        })
      })
    ) {
      return true
    }
  }
  return false
}

export const checkRolePublic = (
  allRoles: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [],
  privateRole: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[] = [],
): boolean => {
  if (!privateRole || privateRole.length < 1) return false

  if (
    allRoles.some((role) => {
      return privateRole.some((userRole) => {
        return userRole === role
      })
    })
  ) {
    return true
  }

  return false
}
