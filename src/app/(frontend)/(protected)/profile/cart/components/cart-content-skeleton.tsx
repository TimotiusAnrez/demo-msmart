export default function CartContentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Cart items skeleton */}
      <div className="md:col-span-2 space-y-6">
        {/* Shop 1 */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-9 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="p-0">
            {/* Item 1 */}
            <div className="p-4 border-b">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-grow space-y-2 w-full">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-40"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-grow space-y-2 w-full">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 flex justify-between">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Shop 2 */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-9 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="p-0">
            {/* Item */}
            <div className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-grow space-y-2 w-full">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-36"></div>
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 flex justify-between">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* Order summary skeleton */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-20"></div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>

            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>

            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-40"></div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>

            <div className="h-px bg-gray-200 my-4"></div>

            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-28"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>

            <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
