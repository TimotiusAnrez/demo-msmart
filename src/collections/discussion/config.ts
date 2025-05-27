import { Collection, CollectionConfig } from 'payload'
import { userOnlyCollectionAccess, userOnlyFieldAccess } from '@/collections/access/userOnly'
import { adminOnlyCollectionAccess, adminOnlyFieldAccess } from '@/collections/access/adminOnly'
import { AnyoneCollectionAccess } from '../access/anyone'
import { ForbiddenCollectionAccess } from '../access/forbidden'
import { userSelfCollectionAccess } from '../access/userSelf'
import { checkRolePublic } from '@/helper/checkRoleHelper'

export const DiscussionCategories: CollectionConfig = {
  slug: 'discussionCategories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdAt'],
    hidden: (args) => {
      return !checkRolePublic(['ADMIN_MS', 'ADMIN_MSAGRI', 'SUPER_ADMIN'], args.user.role)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    {
      name: 'discussionList',
      type: 'join',
      collection: 'discussion',
      on: 'category',
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      label: 'Archived',
      required: false,
      defaultValue: false,
    },
  ],
}

export const DiscussionComment: CollectionConfig = {
  slug: 'discussionComment',
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: 'commenter',
      type: 'relationship',
      relationTo: 'users',
      required: true, //if comment archived, commenter will be default
    },
    {
      name: 'content',
      type: 'text',
      required: true, //if comment archived, content will be comment deleted
    },
    {
      name: 'discussion',
      type: 'relationship',
      relationTo: 'discussion',
      required: true,
    },
    {
      name: 'isReported',
      type: 'checkbox',
      required: false,
      defaultValue: false,
    },
    {
      name: 'archived',
      type: 'checkbox',
      required: false,
      defaultValue: false,
    },
  ],
}

export const Discussion: CollectionConfig = {
  slug: 'discussion',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return `${siblingData.category[0].name ? siblingData.category[0].name : ''} ${siblingData.title}`
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: {
        create: userOnlyFieldAccess,
        update: () => false,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'discussionCategories',
      required: true,
      hasMany: true,
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'open',
          value: 'OPEN',
        },
        {
          label: 'reported',
          value: 'REPORTED',
        },
        {
          label: 'archived',
          value: 'ARCHIVED',
        },
      ],
      enumName: 'DiscussionStatus',
      defaultValue: 'OPEN',
      required: true,
      access: {
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'content',
      type: 'text',
      required: true,
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: false,
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'reportList',
      type: 'array',
      maxRows: 5,
      access: {
        read: adminOnlyFieldAccess,
        create: userOnlyFieldAccess,
        update: () => false,
      },
      fields: [
        {
          name: 'reportType',
          type: 'select',
          options: [
            {
              label: 'Spam',
              value: 'SPAM',
            },
            {
              label: 'Fake Information',
              value: 'FAKE_INFORMATION',
            },
            {
              label: 'Other',
              value: 'OTHER',
            },
          ],
          enumName: 'ReportType',
          required: true,
          label: 'Report Type',
        },
        {
          name: 'reportContent',
          type: 'text',
          required: true,
          label: 'Reason',
        },
        {
          name: 'reporter',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          access: {
            create: userOnlyFieldAccess,
            update: () => false,
          },
        },
        {
          name: 'confirmed',
          type: 'checkbox',
          required: false,
          defaultValue: false,
          access: {
            create: adminOnlyFieldAccess,
            update: adminOnlyFieldAccess,
          },
        },
      ],
    },
    {
      name: 'commentList',
      type: 'join',
      collection: 'discussionComment',
      on: 'discussion',
    },
  ],
}
