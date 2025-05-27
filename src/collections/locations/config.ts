import { CollectionConfig } from 'payload'
import { adminOnlyCollectionAccess } from '../access/adminOnly'
import { checkRolePublic } from '@/helper/checkRoleHelper'

export const LocationCategories: CollectionConfig = {
  slug: 'locationCategories',
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
      name: 'locationList',
      type: 'join',
      collection: 'locations',
      on: 'category',
    },
  ],
}

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    hidden: (args) => {
      return !checkRolePublic(['ADMIN_MS', 'ADMIN_MSAGRI', 'SUPER_ADMIN'], args.user.role)
    },
  },
  fields: [
    {
      name: 'MediaGallery',
      type: 'array',
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
      ],
      maxRows: 5,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'locationCategories',
          required: true,
          hasMany: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'text',
      required: false,
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
          required: true,
        },
        {
          name: 'geo',
          type: 'point',
          required: true,
        },
      ],
    },
  ],
}
