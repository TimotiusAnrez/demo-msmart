import Link from 'next/link'
import { FarmerProduce } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ProduceCard } from '@/app/(frontend)/(public)/(agriculture)/agriculture/components/produce-card'

interface SimilarProduceProps {
  produce: FarmerProduce[]
}

export default function SimilarProduce({ produce }: SimilarProduceProps) {
  if (produce.length === 0) return null

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Similar Produce</h2>
        <Link href="/agriculture">
          <Button variant="outline">Browse All</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {produce.map((item) => (
          <ProduceCard key={item.id} produce={item} />
        ))}
      </div>
    </section>
  )
}
