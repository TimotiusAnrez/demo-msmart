import { NewsParagraphBlock } from '@/payload-types'

interface NewsParagraphProps {
  block: NewsParagraphBlock
}

export function NewsParagraphComponent({ block }: NewsParagraphProps) {
  if (!block) return null

  return (
    <div className="mb-8">
      {block.paragraphTitle ? (
        <h2 className="text-2xl font-bold mb-4">{block.paragraphTitle}</h2>
      ) : null}
      <div className="whitespace-pre-wrap leading-relaxed">{block.content}</div>
    </div>
  )
}
