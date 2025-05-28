import { Collection, CollectionConfig } from 'payload'

export const ActivityCategory: CollectionConfig = {
  slug: 'activityCategory',
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
