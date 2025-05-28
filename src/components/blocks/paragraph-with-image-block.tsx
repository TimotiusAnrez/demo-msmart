import Image from 'next/image'
import { ParagraphWithImageBlock, Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface ParagraphWithImageProps {
  block: ParagraphWithImageBlock
}

export function ParagraphWithImageComponent({ block }: ParagraphWithImageProps) {
  const imageData = block.image as Media
  const { content, position } = block
  const paragraphTitle = block.paragraphTitle ? block.paragraphTitle : ''

  return (
    <div
      className={cn(
        'mb-8',
        position === 'left'
          ? 'md:flex md:flex-row-reverse md:gap-8'
          : position === 'right'
            ? 'md:flex md:gap-8'
            : 'block',
      )}
    >
      {/* Content Section */}
      <div className={cn(position !== 'default' ? 'md:flex-1' : '')}>
        {paragraphTitle ? <h2 className="text-2xl font-bold mb-4">{paragraphTitle}</h2> : null}
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
      </div>

      {/* Image Section */}
      {imageData?.url ? (
        <div
          className={cn(
            'relative my-6 overflow-hidden rounded-lg',
            position !== 'default' ? 'md:my-0 md:w-2/5' : 'aspect-[16/9] w-full',
          )}
        >
          <Image
            src={imageData.url}
            alt={imageData.alt || paragraphTitle || 'Article image'}
            width={800}
            height={500}
            className="object-cover h-full w-full"
          />
        </div>
      ) : null}
    </div>
  )
}
