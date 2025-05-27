import { CollectionConfig } from 'payload'
import { adminOnlyCollectionAccess } from '../access/adminOnly'

export const Facility: CollectionConfig = {
  slug: 'facility',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdAt'],
  },
  access: {
    create: adminOnlyCollectionAccess,
    update: adminOnlyCollectionAccess,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            {
              label: 'Public',
              value: 'PUBLIC',
            },
            {
              label: 'Private',
              value: 'PRIVATE',
            },
          ],
          required: true,
        },
        {
          name: 'sector',
          type: 'select',
          options: [
            {
              label: 'Health',
              value: 'HEALTH',
            },
            {
              label: 'Education',
              value: 'EDUCATION',
            },
            {
              label: 'Government',
              value: 'GOVERNMENT',
            },
            {
              label: 'Public Service',
              value: 'PUBLIC_SERVICE',
            },
            {
              label: 'Infrastructure',
              value: 'INFRASTRUCTURE',
            },
          ],
          required: true,
          defaultValue: 'PUBLIC_SERVICE',
          enumName: 'InstitutionType',
        },
      ],
    },

    {
      name: 'isArchived',
      type: 'checkbox',
      label: 'Archived',
      required: false,
      defaultValue: false,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
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
    {
      name: 'contactList',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            {
              label: 'Email',
              value: 'EMAIL',
            },
            {
              label: 'Phone',
              value: 'PHONE',
            },
            {
              label: 'Whatsaap',
              value: 'WHATSAPP',
            },
            {
              label: 'Website',
              value: 'WEBSITE',
            },
          ],
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
