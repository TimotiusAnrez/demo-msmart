import { userSelfCollectionAccess } from '@/collections/access/userSelf'
import { CartItem } from '@/payload-types'
import { CollectionConfig } from 'payload'

export const CartItems: CollectionConfig = {
  slug: 'cartItems',
  admin: {
    useAsTitle: 'product',
  },
  fields: [
    {
      name: 'cart',
      type: 'relationship',
      relationTo: 'cart',
      required: true,
      hasMany: false,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'shopProducts',
      required: true,
      hasMany: false,
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'productVariant',
      required: false,
      hasMany: false,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
    },
  ],
}

export const Carts: CollectionConfig = {
  slug: 'cart',
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
      name: 'cartItemList',
      type: 'join',
      collection: 'cartItems',
      on: 'cart',
      hasMany: true,
    },
  ],
}
