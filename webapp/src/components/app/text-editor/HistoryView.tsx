import { DiffEditor } from '@monaco-editor/react'
import React, { useContext } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { GlobalContext } from '../../App'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 240px);
  display: flex;
`

const HistoryView = (props: { type: string; data: string }) => {
  const { type, data } = props
  const { isMobile, pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)
  return (
    <>
      <Container>
        <DiffEditor
          width="100%"
          height="100%"
          original={data}
          originalLanguage={type}
          modified={currentPage.get('content')}
          modifiedLanguage={currentPage.get('type')}
          options={{
            wordWrap: currentPage.get('options').word_wrap ? 'on' : 'off',
            fontFamily: currentPage.get('options').font_family,
            fontSize: currentPage.get('options').font_size,
            lineHeight: currentPage.get('options').line_height,
            padding: {
              top: 16,
              bottom: 16,
            },
            minimap: {
              enabled: !isMobile,
              scale: 1,
              maxColumn: 150,
            },
            readOnly: 'true',
          }}
        />
      </Container>
    </>
  )
}

export default HistoryView
