import Editor from '@monaco-editor/react'
import { InlineLoading } from 'carbon-components-react'
import React, { useContext, useRef, useState } from 'react'

import styled from 'styled-components'
import { DataContext } from '../App'

import ToolBar from './ToolBar'

const Wrapper = styled.div`
  overflow: hidden;
`

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const TextEditor = () => {
  const [type, setType] = useState({ id: -1, name: 'Text', slug: 'text' })

  const editorRef = useRef()

  function handleEditorDidMount(_: any, editor: any) {
    editorRef.current = editor
  }

  const { isMobile } = useContext(DataContext)

  return (
    <Wrapper>
      <ToolBar
        mobile={isMobile}
        editor={editorRef}
        type={type}
        setType={setType}
      />
      <Editor
        width="100%"
        height="calc(100vh - 88px)"
        className="editor"
        theme="light"
        language={type.slug}
        loading={
          <LoadingWrapper>
            <InlineLoading description="Editor Loading ..." />
          </LoadingWrapper>
        }
        options={{
          fontFamily:
            "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace",
          fontSize: 14,
          lineHeight: 22,
          padding: {
            top: 16,
            bottom: 16,
          },
          minimap: {
            enabled: !isMobile,
            scale: 1,
            maxColumn: 150,
          },
        }}
        editorDidMount={handleEditorDidMount}
      />
    </Wrapper>
  )
}

export default TextEditor
