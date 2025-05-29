'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function PlanTrip() {
  const imageList = {
    1: 'https://images.unsplash.com/photo-1725073696774-dc3c2dc0a35e?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    2: 'https://images.unsplash.com/photo-1657788405193-c2039edaad6b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    3: 'https://images.unsplash.com/photo-1694271486229-9b965b67025a?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  }

  return (
    <section className="relative">
      {/* Background decorative elements */}
      {/* <div className="absolute left-0 top-0 opacity-30">
        <Image src="/images/balloon-decoration1.svg" alt="" width={60} height={60} />
      </div>
      <div className="absolute left-20 top-12 opacity-30">
        <Image src="/images/balloon-decoration2.svg" alt="" width={30} height={30} />
      </div>
      <div className="absolute right-0 bottom-20 opacity-30">
        <Image src="/images/car-decoration.svg" alt="" width={100} height={60} />
      </div>
      <div className="absolute right-10 top-10 opacity-30">
        <Image src="/images/trees-decoration.svg" alt="" width={50} height={50} />
      </div> */}

      <div className="container mx-auto px-4">
        <div className="flex gap-x-8 items-center">
          {/* Left side images */}
          <div className="grid grid-cols-5 grid-rows-4 gap-4 relative w-1/2">
            <div className="col-start-1 col-end-4 row-start-1 rounded-t-full row-end-4 overflow-hidden rounded-bl-full">
              <Image
                src={imageList[1]}
                alt="Mountaineering"
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="col-start-4 col-end-6 row-start-1 rounded-full row-end-2 overflow-hidden rounded-bl-[2rem]">
              <Image
                src={imageList[2]}
                alt="Kayaking"
                width={280}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="col-start-4 col-end-6 row-start-2 row-end-4 overflow-hidden">
              <Image
                src={imageList[3]}
                alt="City tour"
                width={280}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Right side content */}
          <div className="lg:pl-12 w-1/2 h-full flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-xl text-[#26B0C2] font-medium">Let's Go Together</h3>
              <h2 className="text-3xl md:text-4xl font-bold text-[#174140] mt-2">
                Plan Your Trip
                <br />
                With Us
              </h2>
              <p className="text-gray-600 mt-4">
                There are many variations of passages of available but the majority have suffered
                alteration in some form, by injected humor randomized words which don't look even
                slightly.
              </p>
            </div>

            <div className="space-y-6">
              {/* Trip planning benefits */}
              <div className="flex gap-4 items-start">
                <div className="bg-[#26B0C2] rounded-full p-3 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map"
                  >
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" x2="9" y1="3" y2="18" />
                    <line x1="15" x2="15" y1="6" y2="21" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Exclusive Trip</h4>
                  <p className="text-gray-500 text-sm">
                    There are many variations of passages of available but the majority.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#26B0C2] rounded-full p-3 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-users"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Professional Guide</h4>
                  <p className="text-gray-500 text-sm">
                    There are many variations of passages of available but the majority.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button className="bg-[#174140] hover:bg-[#0d2927] flex items-center gap-2">
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-right"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
