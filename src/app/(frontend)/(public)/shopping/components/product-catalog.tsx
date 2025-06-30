'use client'

import { useState } from 'react'
import { ShopProduct, ShopProductCategory } from '@/payload-types'
import { ProductCard } from './product-card'
import { ProductFilter } from './product-filter'
import { ProductSearch } from './product-search'
import { ProductSort } from './product-sort'
import { ProductPagination } from './product-pagination'
import { Separator } from '@/components/ui/separator'

interface ProductCatalogProps {
  products: ShopProduct[]
  categories: ShopProductCategory[]
  totalPages: number
  currentPage: number
  totalProducts: number
  searchQuery: string
  selectedCategory?: string
  // sortOption: string
}

export function ProductCatalog({
  products,
  categories,
  totalPages,
  currentPage,
  totalProducts,
  searchQuery,
  selectedCategory,
  // sortOption,
}: ProductCatalogProps) {
  return (
    <section id="product-catalog" className="py-8">
      <h2 className="text-2xl font-bold mb-6">We Got Everything You Need.</h2>

      {/* Filters and search row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <ProductFilter categories={categories} selectedCategory={selectedCategory} />
          <ProductSearch defaultValue={searchQuery} />
        </div>
        {/* <ProductSort currentValue={sortOption} /> */}
      </div>

      <Separator className="my-6" />

      {/* Results info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} of {totalProducts} products
        </p>
      </div>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter to find what you are looking for.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && <ProductPagination totalPages={totalPages} currentPage={currentPage} />}
    </section>
  )
}
