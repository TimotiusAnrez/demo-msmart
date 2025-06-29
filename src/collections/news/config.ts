import { checkRolePublic } from '@/helper/checkRoleHelper'
import { Block, CollectionConfig, Field } from 'payload'

export const NewsCategories: CollectionConfig = {
  slug: 'newsCategory',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
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

const NewsMeta: Field = {
  name: 'meta',
  type: 'group',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'newsCategory',
      required: true,
      hasMany: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

const NewsParagraph: Block = {
  slug: 'newsParagraphBlock',
  interfaceName: 'NewsParagraphBlock',
  labels: {
    singular: 'paragraph',
    plural: 'paragraphs',
  },
  fields: [
    {
      name: 'paragraphTitle',
      type: 'text',
      required: false,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
  ],
}

const ParagraphWithImage: Block = {
  slug: 'paragraphWithImageBlock',
  interfaceName: 'ParagraphWithImageBlock',
  labels: {
    singular: 'paragraph with image',
    plural: 'paragraphs with image',
  },
  fields: [
    {
      name: 'paragraphTitle',
      type: 'text',
      required: false,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'position',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      required: true,
      defaultValue: 'default',
    },
  ],
}

const ContentSection: Field = {
  name: 'newsContentSection',
  type: 'blocks',
  blocks: [NewsParagraph, ParagraphWithImage],
}

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'newsTitle',
    hidden: (args) => {
      return !checkRolePublic(['ADMIN_MS', 'ADMIN_MSAGRI', 'SUPER_ADMIN'], args.user.role)
    },
  },
  fields: [
    {
      name: 'newsTitle',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData['newsTitle']
          },
        ],
        afterRead: [
          ({ siblingData }) => {
            return siblingData?.meta?.title
          },
        ],
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
    NewsMeta,
    ContentSection,
  ],
}
