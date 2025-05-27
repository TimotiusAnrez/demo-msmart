import { checkRolePublic } from '@/helper/checkRoleHelper'
import { CollectionConfig } from 'payload'

export const NewsCategories: CollectionConfig = {
  slug: 'newsCategory',
  admin: {
    useAsTitle: 'name',
    hidden: (args) => {
      return !checkRolePublic(['ADMIN_MS', 'ADMIN_MSAGRI', 'SUPER_ADMIN'], args.user.role)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      label: 'Archived',
      required: false,
      defaultValue: false,
    },
  ],
}

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'newsTitle',
    hidden: (args) => {
      return !checkRolePublic(['ADMIN_MS', 'ADMIN_MSAGRI', 'SUPER_ADMIN'], args.user.role)
    },
  },
  fields: [
    {
      name: 'newsTitle',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData['newsTitle']
          },
        ],
        afterRead: [
          ({ siblingData }) => {
            return siblingData?.meta?.title
          },
        ],
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },

        {
          name: 'category',
          type: 'relationship',
          relationTo: 'newsCategory',
          required: true,
          hasMany: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'banner',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
