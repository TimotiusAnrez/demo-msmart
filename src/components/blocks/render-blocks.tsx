import { NewsParagraphComponent } from '@/components/blocks/news-paragraph-block'
import { ParagraphWithImageComponent } from '@/components/blocks/paragraph-with-image-block'
import { News } from '@/payload-types'
import { Fragment } from 'react'

const blockComponents = {
  newsParagraphBlock: NewsParagraphComponent,
  paragraphWithImageBlock: ParagraphWithImageComponent,
}

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

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              return (
                <div key={block.blockType}>
                  <Block block={block} />
                </div>
              )
            }
            return null
          }
        })}
      </Fragment>
    )
  }
  return null
}
