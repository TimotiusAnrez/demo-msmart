import { checkRolePublic } from '@/helper/checkRoleHelper'
import { Field, GlobalConfig } from 'payload'

const HeroSection: Field = {
  name: 'heroSection',
  type: 'group',
  interfaceName: 'HeroSection',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'tagLine',
      type: 'text',
      required: true,
    },
    {
      name: 'copy',
      type: 'text',
      required: true,
    },
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}

export const LandingPage: GlobalConfig = {
  slug: 'landingPage',
  admin: {
    hidden: (req) => {
      const allowedRole: (
        | 'ADMIN_MS'
        | 'SUPER_ADMIN'
        | 'USER'
        | 'USER_BUSINESS'
        | 'ADMIN_MSAGRI'
      )[] = ['ADMIN_MS', 'SUPER_ADMIN']

      return !checkRolePublic(allowedRole, req.user?.role)
    },
  },
  fields: [HeroSection],
}
