import { userSelfCollectionAccess } from '@/collections/access/userSelf'
import { CartItem } from '@/payload-types'
import { CollectionConfig } from 'payload'

export const AgriCartItems: CollectionConfig = {
  slug: 'agriCartItems',
  fields: [
    {
      name: 'agriCart',
      type: 'relationship',
      relationTo: 'agriCart',
      required: true,
      hasMany: false,
    },
    {
      name: 'produce',
      type: 'relationship',
      relationTo: 'farmerProduce',
      required: true,
      hasMany: false,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
    },
  ],
}

export const AgriCarts: CollectionConfig = {
  slug: 'agriCart',
  access: {
    read: userSelfCollectionAccess,
    create: userSelfCollectionAccess,
    update: userSelfCollectionAccess,
    delete: userSelfCollectionAccess,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'agriCartItemList',
      type: 'join',
      collection: 'agriCartItems',
      on: 'agriCart',
      hasMany: true,
    },
  ],
}
