import { TransactionItemDetail } from '@/payload-types'
import { CollectionConfig } from 'payload'

export const Transaction: CollectionConfig = {
  slug: 'transaction',
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'shop',
      type: 'relationship',
      relationTo: 'shops',
      required: true,
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'PENDING',
        },
        {
          label: 'Completed',
          value: 'COMPLETED',
        },
        {
          label: 'Failed',
          value: 'FAILED',
        },
      ],
      defaultValue: 'PENDING',
      enumName: 'TransactionStatus',
      required: true,
    },
    {
      name: 'itemList',
      type: 'array',
      fields: [
        {
          name: 'transactionItemDetail',
          type: 'group',
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
          interfaceName: 'TransactionItemDetail',
        },
      ],
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
      virtual: true,
      hooks: {
        afterRead: [
          ({ data }) => {
            if (!data?.itemList || data.itemList.length < 1) return 0

            let totalPrice = 0

            data.itemList.forEach((item: TransactionItemDetail) => {
              if (!item.variant || typeof item.variant === 'number') return

              totalPrice = totalPrice + item.variant.price * item.quantity
            })

            return totalPrice
          },
        ],
      },
    },
  ],
}
