import type { CollectionConfig, Field } from 'payload'
import { ClerkAuthStrategy } from './strategies/clerkStrategy'
import { superAdminOnlyFieldAccess } from '@/collections/access/superAdminOnly'
import { adminOnlyFieldAccess } from '../access/adminOnly'
import { userSelfCollectionAccess } from '../access/userSelf'
import { userOnlyCollectionAccess } from '../access/userOnly'

const userInformation: Field = {
  type: 'group',
  name: 'information',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'gender',
          type: 'select',
          options: [
            {
              label: 'Male',
              value: 'male',
            },
            {
              label: 'Female',
              value: 'female',
            },
          ],
          required: true,
        },
        {
          name: 'DOB',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
}

const contactField: Field = {
  type: 'group',
  name: 'contact',
  fields: [
    {
      type: 'group',
      name: 'email',
      fields: [
        {
          name: 'handler', //email name eg. johnDoe@gmail.com
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'isVerified',
          type: 'checkbox',
          required: true,
          defaultValue: true, //since it is come from clerk, then it is verified
        },
      ],
    },
    {
      type: 'group',
      name: 'phone',
      fields: [
        //todo: add country code later on, but still wondering if it is useful?
        {
          name: 'number', //phone number eg. 08123456789
          type: 'text',
          required: false,
        },
        {
          name: 'isVerified',
          type: 'checkbox',
          required: false,
          defaultValue: false,
        },
      ],
    },
  ],
}

const verificationField: Field = {
  type: 'group',
  name: 'verification',
  fields: [
    {
      name: 'documentType',
      type: 'select',
      options: [
        {
          label: 'Passport',
          value: 'PASSPORT',
        },
        {
          label: 'ID Card',
          value: 'IDCARD',
        },
      ],
      required: false,
    },
    {
      name: 'documentNumber',
      type: 'text',
      required: false,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Unverified',
          value: 'UNVERIFIED',
        },
        {
          label: 'Verification Requested',
          value: 'VERIFICATION_REQUEST',
        },
        {
          label: 'Declined',
          value: 'DECLINED',
        },
        {
          label: 'Verified',
          value: 'VERIFIED',
        },
      ],
      defaultValue: 'UNVERIFIED',
      enumName: 'UserVerificationStatus',
      required: true,
      access: {
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'rejectReason',
      type: 'group',
      fields: [
        {
          name: 'reason',
          type: 'select',
          options: [
            {
              label: 'Document not valid',
              value: 'INVALID_DOCUMENT',
            },
            {
              label: 'Document expired',
              value: 'EXPIRED_DOCUMENT',
            },
            {
              label: 'Document not match',
              value: 'NOT_MATCH_DOCUMENT',
            },
            {
              label: 'Contact Information not complete',
              value: 'INCOMPLETE_CONTACT_INFO',
            },
            {
              label: 'Other',
              value: 'OTHER',
            },
          ],
          required: false,
        },
        {
          name: 'description',
          type: 'text',
          required: false,
        },
        {
          name: 'isResolved',
          type: 'checkbox',
          required: false,
          defaultValue: false,
          access: {
            create: adminOnlyFieldAccess,
            update: adminOnlyFieldAccess,
          },
        },
      ],
      access: {
        create: adminOnlyFieldAccess,
      },
    },
  ],
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [ClerkAuthStrategy],
  },
  access: {
    read: userSelfCollectionAccess,
    create: () => true,
    delete: userOnlyCollectionAccess,
  },
  admin: {
    useAsTitle: 'fullName',
  },
  fields: [
    {
      type: 'text',
      name: 'fullName',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData['fullName']
          },
        ],
        afterRead: [({ data }) => `${data?.information?.firstName} ${data?.information?.lastName}`],
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'clerkID',
          required: true,
          access: {
            read: () => true,
            update: () => false,
            create: () => true,
          },
        },
        {
          type: 'row',
          fields: [
            {
              type: 'select',
              name: 'role',
              options: [
                {
                  label: 'User',
                  value: 'USER',
                },
                {
                  label: 'User Business',
                  value: 'USER_BUSINESS',
                },
                {
                  label: 'Admin MSmart',
                  value: 'ADMIN_MS', //tourism and public service
                },
                {
                  label: 'Admin MSmart Agri',
                  value: 'ADMIN_MSAGRI', //agriculture manager
                },
                {
                  label: 'Super Admin',
                  value: 'SUPER_ADMIN',
                },
              ],
              defaultValue: 'USER',
              enumName: 'UserRole',
              required: true,
              hasMany: true,
              access: {
                update: superAdminOnlyFieldAccess,
                read: adminOnlyFieldAccess,
              },
              saveToJWT: true,
            },
            {
              name: 'isSuspended',
              type: 'checkbox',
              defaultValue: false,
              required: false,
              admin: {
                width: '20%',
                hidden: true,
              },
              access: {
                update: adminOnlyFieldAccess,
                read: adminOnlyFieldAccess,
              },
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Information',
          fields: [userInformation, contactField, verificationField],
        },
      ],
    },
  ],
}
