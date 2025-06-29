import { ProfileHeader } from '@/components/profile/profile-header'

export default function AgriCartContentSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader title="Agricultural Cart" />
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <div className="text-6xl mb-4">🌾</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your agricultural cart is empty
        </h3>
        <p className="text-muted-foreground mb-4">
          Browse our fresh produce and add items to your cart.
        </p>
        <a
          href="/agriculture"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Browse Agricultural Products
        </a>
      </div>
    </div>
  )
}
