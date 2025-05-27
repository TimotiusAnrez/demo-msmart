import { adminOnlyCollectionAccess } from '@/collections/access/adminOnly'
import { ForbiddenCollectionAccess } from '@/collections/access/forbidden'
import { userOnlyCollectionAccess } from '@/collections/access/userOnly'
import { userSelfCollectionAccess } from '@/collections/access/userSelf'
import { CollectionConfig, Field } from 'payload'

export const ShopProductCategory: CollectionConfig = {
  slug: 'shopProductCategory',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'productList',
      type: 'join',
      collection: 'shopProducts',
      on: 'category',
    },
  ],
}

export const ProductInformation: Field = {
  type: 'group',
  name: 'information',
  fields: [
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
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
  ],
}

export const ProductVariant: CollectionConfig = {
  slug: 'productVariant',
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'shopProducts',
      required: true,
      hasMany: false,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
    },
  ],
}

export const ShopProducts: CollectionConfig = {
  slug: 'shopProducts',
  admin: {
    useAsTitle: 'productName',
    hidden: true,
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData.productName
          },
        ],
        afterRead: [
          ({ data }) => {
            return `${data?.information?.name}`
          },
        ],
      },
      admin: {
        hidden: true,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Information',
          fields: [
            {
              name: 'owner',
              type: 'relationship',
              relationTo: 'shops',
              required: true,
              admin: {
                hidden: true,
              },
            },
            ProductInformation,
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'shopProductCategory',
              required: true,
              hasMany: true,
            },
          ],
        },
        {
          label: 'Variant List',
          fields: [
            {
              name: 'variantList',
              type: 'join',
              collection: 'productVariant',
              on: 'product',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
