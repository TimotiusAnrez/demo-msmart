import { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'cart',
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'itemList',
      type: 'array',
      fields: [
        {
          type: 'group',
          name: 'cartItem',
          interfaceName: 'CartItem',
          fields: [
            {
              name: 'item',
              type: 'relationship',
              relationTo: 'shopProducts',
              required: true,
              hasMany: false,
            },
            {
              name: 'quantity',
              type: 'number',
              required: true,
            },
            {
              name: 'variant',
              type: 'relationship',
              relationTo: 'productVariant',
              required: true,
              hasMany: false,
            },
          ],
        },
      ],
    },
  ],
}
