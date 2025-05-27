import { checkRolePublic } from '@/helper/checkRoleHelper'
import { CollectionConfig } from 'payload'

export const Farmers: CollectionConfig = {
  slug: 'farmers',
  admin: {
    useAsTitle: 'fullName',
    hidden: (args) => {
      return !checkRolePublic(['ADMIN_MSAGRI', 'SUPER_ADMIN'], args.user.role)
    },
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData.fullName
          },
        ],
        afterRead: [
          ({ data }) => {
            return `${data?.personal?.firstName} ${data?.personal?.lastName}`
          },
        ],
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'information',
          fields: [
            {
              name: 'personal',
              type: 'group',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'whatsapp',
                  type: 'text',
                  required: true,
                },
              ],
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
        },
        {
          label: 'Produce List',
          fields: [
            {
              name: 'produceList',
              type: 'join',
              collection: 'farmerProduce',
              on: 'farmer',
            },
          ],
        },
      ],
    },
  ],
}
