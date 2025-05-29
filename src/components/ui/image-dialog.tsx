'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ImageDialogProps {
  src: string
  alt: string
  width?: number
  height?: number
}

export function ImageDialog({ src, alt, width = 800, height = 800 }: ImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer overflow-hidden h-96 rounded-lg border transition-all hover:opacity-90">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <div className="aspect-square w-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={1200}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
