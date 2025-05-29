'use client'

import { FarmerProduce, ProduceCategory } from '@/payload-types'
import { ProduceCard } from './produce-card'
import { ProduceFilter } from './produce-filter'
import { ProducePagination } from './produce-pagination'
import { ProduceSearch } from './produce-search'

interface ProduceCatalogProps {
  produce: FarmerProduce[]
  categories: ProduceCategory[]
  totalPages: number
  currentPage: number
  totalProduce: number
  searchQuery: string
  selectedCategory: string
}

export function ProduceCatalog({
  produce,
  categories,
  totalPages,
  currentPage,
  totalProduce,
  searchQuery,
  selectedCategory,
}: ProduceCatalogProps) {
  return (
    <section className="mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Browse Farm Produce</h2>
        <p className="text-muted-foreground mt-1">
          {totalProduce} {totalProduce === 1 ? 'item' : 'items'} available
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ProduceSearch searchQuery={searchQuery} />
        <ProduceFilter categories={categories} selectedCategory={selectedCategory} />
      </div>

      {produce.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produce.map((item) => (
            <ProduceCard key={item.id} produce={item} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="text-xl font-semibold">No produce found</h3>
          <p className="text-muted-foreground mt-2">Try changing your search or filter criteria</p>
        </div>
      )}

      <ProducePagination totalPages={totalPages} currentPage={currentPage} />
    </section>
  )
}
