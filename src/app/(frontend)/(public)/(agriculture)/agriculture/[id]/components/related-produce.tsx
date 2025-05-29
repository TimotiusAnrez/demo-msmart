import Link from 'next/link'
import { FarmerProduce } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ProduceCard } from '@/app/(frontend)/(public)/(agriculture)/agriculture/components/produce-card'

interface RelatedProduceProps {
  produce: FarmerProduce[]
  farmerId: number
  farmerName: string
}

export default function RelatedProduce({ produce, farmerId, farmerName }: RelatedProduceProps) {
  if (produce.length === 0) return null

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">More from {farmerName}</h2>
        <Link href={`/agriculture?farmer=${farmerId}`}>
          <Button variant="outline">View All</Button>
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
