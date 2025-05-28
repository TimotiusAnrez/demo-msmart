import { CollectionConfig } from 'payload'

export const FnbCategory: CollectionConfig = {
  slug: 'fnbCategory',
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
