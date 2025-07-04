import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const RichTextConverter = ({ data }: { data: SerializedEditorState }) => {
  return <RichText data={data} />
}
