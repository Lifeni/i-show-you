import Editor from '@monaco-editor/react'
import { Loading } from 'carbon-components-react'
import React, { useRef, useState } from 'react'

import styled from 'styled-components'

import '../styles/TextEditor.css'
import ToolBar from './ToolBar'

const Wrapper = styled.div`
  overflow: hidden;
`

const TextEditor = () => {
  const [type, setType] = useState({ id: -1, name: 'Text', slug: 'text' })
  const [mobile, setMobile] = useState(false)

  const editorRef = useRef()

  function handleEditorDidMount(_: any, editor: any) {
    editorRef.current = editor
  }

  const checkMobile = () => {
    if (window.innerWidth < 720) {
      setMobile(true)
    } else {
      setMobile(false)
    }
  }

  window.addEventListener('DOMContentLoaded', checkMobile)

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(checkMobile)
  })

  return (
    <Wrapper>
      <ToolBar
        mobile={mobile}
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
          <Loading description="Editor Loading ..." withOverlay={false} />
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
            enabled: !mobile,
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
