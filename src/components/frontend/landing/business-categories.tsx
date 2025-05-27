import { Card, CardContent } from '@/components/ui/card'
import { Coffee, Utensils, ShoppingBag, Camera, Car, Waves } from 'lucide-react'
import { ShopCategory } from '@/payload-types'

const iconMap = {
  Coffee,
  Utensils,
  ShoppingBag,
  Camera,
  Car,
  Waves,
}

interface BusinessCategoriesProps {
  categories: ShopCategory[]
}

export function BusinessCategories({ categories }: BusinessCategoriesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore Local Businesses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover authentic local experiences and support our community businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: ShopCategory, index) => {
            // const Icon = iconMap[category.icon as keyof typeof iconMap] || Coffee
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  {/* <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <Icon className="h-8 w-8 text-orange-500" />
                  </div> */}
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-primary font-medium">
                    {category.shopList?.docs?.length || ''}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
