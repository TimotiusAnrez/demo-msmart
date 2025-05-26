import { CollectionConfig } from 'payload'
import { shopContact, shopInformation, shopLocation } from './fields'
import { ForbiddenCollectionAccess } from '@/collections/access/forbidden'
import { userOnlyCollectionAccess } from '../access/userOnly'
import { userSelfCollectionAccess } from '../access/userSelf'
import { adminOnlyCollectionAccess } from '../access/adminOnly'

export const ShopCategories: CollectionConfig = {
  slug: 'shopCategories',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'shopList',
      type: 'join',
      collection: 'shops',
      on: 'category',
    },
  ],
}

export const Shop: CollectionConfig = {
  slug: 'shops',
  admin: {
    useAsTitle: 'shopName',
    defaultColumns: ['shopName', 'information', 'location', 'contact', 'createdAt'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Information',
          fields: [
            {
              name: 'shopName',
              type: 'text',
              hooks: {
                afterRead: [
                  ({ data }) => {
                    return `${data?.information?.legalName} `
                  },
                ],
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'shopCategories',
              required: true,
            },
            {
              name: 'mediaGallery',
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
            shopInformation,
            shopLocation,
            shopContact,
          ],
        },
        {
          label: 'Product List',
          fields: [
            {
              name: 'productList',
              type: 'join',
              collection: 'shopProducts',
              on: 'owner',
              required: false,
            },
          ],
        },
      ],
    },
  ],
}
