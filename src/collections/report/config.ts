import { Access, CollectionConfig, FieldAccess } from 'payload'
import { userOnlyCollectionAccess, userOnlyFieldAccess } from '@/collections/access/userOnly'
import { adminOnlyCollectionAccess, adminOnlyFieldAccess } from '@/collections/access/adminOnly'

export const ReportCategories: CollectionConfig = {
  slug: 'reportCategories',
  admin: {
    defaultColumns: ['name', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'ReportList',
      type: 'join',
      collection: 'reports',
      on: 'category',
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

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    defaultColumns: ['media', 'title', 'category', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: {
        create: userOnlyFieldAccess,
        update: () => false,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'reportCategories',
      required: true,
      hasMany: true,
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'open',
          value: 'OPEN',
        },
        {
          label: 'on review',
          value: 'ON_REVIEW',
        },
        {
          label: 'closed',
          value: 'CLOSED',
        },
      ],
      enumName: 'ReportStatus',
      defaultValue: 'OPEN',
      required: true,
      access: {
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'content',
      type: 'text',
      required: true,
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'adminResponse',
      type: 'array',
      fields: [
        {
          name: 'comment',
          type: 'text',
          required: true,
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'admin',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          hooks: {
            beforeChange: [
              ({ req }) => {
                return req.user
              },
            ],
          },
        },
      ],
      required: false,
      maxRows: 1,
      access: {
        read: adminOnlyFieldAccess,
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
  ],
}
