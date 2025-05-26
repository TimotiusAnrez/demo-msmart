import { Field } from 'payload'

/**
 * Taking inspiration from trip advisor
 */
export const shopInformation: Field = {
  type: 'group',
  name: 'information',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'legalName',
          type: 'text',
          required: true,
        },
        {
          name: 'tradingName',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'ShopInformation',
}

export const shopLocation: Field = {
  type: 'group',
  name: 'location',
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
}

export const shopContact: Field = {
  type: 'group',
  name: 'contact',
  fields: [
    {
      name: 'email',
      type: 'email',
      required: false,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'whatsapp',
      type: 'text',
      required: false,
    },
    {
      name: 'website',
      type: 'text',
      required: false,
    },
  ],
}
