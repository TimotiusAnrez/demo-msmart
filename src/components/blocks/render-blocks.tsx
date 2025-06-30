import { NewsParagraphComponent } from '@/components/blocks/news-paragraph-block'
import { ParagraphWithImageComponent } from '@/components/blocks/paragraph-with-image-block'
import { News, NewsParagraphBlock, ParagraphWithImageBlock } from '@/payload-types'
import { Fragment } from 'react'

export const RenderBlocks: React.FC<{
  blocks: News['newsContentSection']
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType === 'newsParagraphBlock') {
            return (
              <div key={`${blockType}-${index}`}>
                <NewsParagraphComponent block={block as NewsParagraphBlock} />
              </div>
            )
          }

          if (blockType === 'paragraphWithImageBlock') {
            return (
              <div key={`${blockType}-${index}`}>
                <ParagraphWithImageComponent block={block as ParagraphWithImageBlock} />
              </div>
            )
          }

          return null
        })}
      </Fragment>
    )
  }
  return null
}
