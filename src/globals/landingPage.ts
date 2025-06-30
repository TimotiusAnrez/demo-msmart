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
  fields: [HeroSection],
}
