import { checkRolePublic } from '@/helper/checkRoleHelper'
import { CollectionConfig } from 'payload'

export const ProduceCategory: CollectionConfig = {
  slug: 'produceCategory',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}

export const FarmerProduce: CollectionConfig = {
  slug: 'farmerProduce',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'farmer',
      type: 'relationship',
      relationTo: 'farmers',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'mediaGalery',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'produceCategory',
      required: true,
    },
    {
      type: 'group',
      name: 'stock',
      fields: [
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'unit',
          type: 'select',
          options: [
            {
              label: 'kg',
              value: 'KG',
            },
            {
              label: 'ton',
              value: 'TON',
            },
          ],
          required: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'price',
      fields: [
        {
          name: 'nominal',
          type: 'number',
          required: true,
        },
        {
          name: 'unit',
          type: 'select',
          options: [
            {
              label: 'kg',
              value: 'KG',
            },
            {
              label: 'ton',
              value: 'TON',
            },
          ],
          required: true,
        },
      ],
    },
  ],
}
