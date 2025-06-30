// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { postgresAdapter } from '@payloadcms/db-postgres'

import {
  Discussion,
  DiscussionCategories,
  DiscussionComment,
  Users,
  Media,
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
  AgriCartItems,
  AgriCarts,
  Carts,
  CartItems,
  Transaction,
  NewsCategories,
  News,
  Farmers,
  FarmerProduce,
  ProduceCategory,
  Pages,
} from './collections'
import { Header } from '@/globals/header.global'
import { LandingPage } from './globals/landingPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
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
    AgriCartItems,
    AgriCarts,
    Carts,
    CartItems,
    Transaction,
    NewsCategories,
    News,
    Farmers,
    FarmerProduce,
    ProduceCategory,
    Pages,
  ],
  globals: [Header, LandingPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // db: sqliteAdapter({
  //   client: {
  //     url: process.env.DATABASE_URI || '',
  //   },
  // }),
  db: postgresAdapter({
    // Postgres-specific arguments go here.
    // `pool` is required.
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
