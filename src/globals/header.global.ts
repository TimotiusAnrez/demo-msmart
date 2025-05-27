import { GlobalConfig } from 'payload'
import { checkRolePublic } from '@/helper/checkRoleHelper'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    hidden: (args) => {
      return !checkRolePublic(['ADMIN_MS', 'SUPER_ADMIN'], args.user?.role)
    },
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'menu',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
        },
      ],
      label: 'Tourism',
    },
    {
      name: 'service',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
        },
      ],
      label: 'Service',
    },
    {
      name: 'agriculture',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
        },
      ],
      label: 'Agriculture',
    },
  ],
}
