// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from '@/collections/users/config'
import { Media } from '@/collections/media/config'
import {
  Discussion,
  DiscussionCategories,
  DiscussionComment,
} from '@/collections/discussion/config'
import { LocationCategories, Locations } from '@/collections/locations/config'
import { ReportCategories, Reports } from '@/collections/report/config'
import { Facility } from '@/collections/institutions/config'
import { ShopCategories, Shop } from '@/collections/shops/config'
import {
  ProductVariant,
  ShopProductCategory,
  ShopProducts,
} from '@/collections/shops/products/config'
import { Carts } from '@/collections/users/cart/config'
import { Transaction } from '@/collections/transaction/config'
import { News, NewsCategories } from '@/collections/news/config'
import { Farmers } from '@/collections/farmers/config'
import { FarmerProduce, ProduceCategory } from '@/collections/farmers/produce/config'
import { Pages } from '@/collections/pages/config'
import { Header } from '@/globals/header.global'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    routes: {
      login: '/auth/sign-in',
      browseByFolder: '/admin',
    },
    components: {
      providers: ['@/components/payload/providers/clerkPayloadProvider'],
    },
  },
  collections: [
    Users,
    Media,
    Discussion,
    DiscussionCategories,
    DiscussionComment,
    Locations,
    LocationCategories,
    Reports,
    ReportCategories,
    Facility,
    ShopCategories,
    Shop,
    ShopProductCategory,
    ShopProducts,
    ProductVariant,
    Carts,
    Transaction,
    NewsCategories,
    News,
    Farmers,
    FarmerProduce,
    ProduceCategory,
    Pages,
  ],
  globals: [Header],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
