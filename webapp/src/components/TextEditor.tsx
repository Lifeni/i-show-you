import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button, TextInput } from 'carbon-components-react'
import {
  Link20,
  RecentlyViewed20,
  SettingsAdjust20,
  TrashCan20,
} from '@carbon/icons-react'

import styled from 'styled-components'

import '../styles/TextEditor.css'
import { findLanguage } from '../utils/identify-file-type'

const Wrapper = styled.div`
  overflow: hidden;
`

const ToolBarWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ToolBarLeftWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const ToolBarCenterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`

const ToolBarRightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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

  const changeLanguage = (e: { target: { value: string } }) => {
    const arr = e.target.value.split('.')
    if (e.target.value.includes('.') && arr.length > 0) {
      const lang = findLanguage(arr[arr.length - 1])
      setType(lang)
    }
  }

  const focusEditor = (e: { code: string }) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      // @ts-ignore
      editorRef.current?.focus()
    }
  }

  return (
    <Wrapper>
      <ToolBarWrapper>
        <ToolBarLeftWrapper className="fixed-width">
          {!mobile && (
            <Button kind="ghost" size="field">
              {type.id === -1 ? 'Local File' : type.name}
            </Button>
          )}

          <Button
            hasIconOnly
            renderIcon={SettingsAdjust20}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            iconDescription="Options"
            kind="ghost"
            size="field"
          />

          <Button
            hasIconOnly
            renderIcon={RecentlyViewed20}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            iconDescription="History"
            kind="ghost"
            size="field"
          />
        </ToolBarLeftWrapper>
        <ToolBarCenterWrapper>
          <TextInput
            labelText=""
            placeholder="Untitled"
            onChange={changeLanguage}
            onKeyPress={focusEditor}
            id="editor-file-name"
          />
        </ToolBarCenterWrapper>
        <ToolBarRightWrapper className="fixed-width">
          <Button
            hasIconOnly
            renderIcon={TrashCan20}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            iconDescription="Remove File"
            kind="ghost"
            size="field"
          />
          {mobile ? (
            <Button
              hasIconOnly
              renderIcon={Link20}
              tooltipAlignment="center"
              tooltipPosition="bottom"
              iconDescription="Get Share Link"
              kind="primary"
              size="field"
            />
          ) : (
            <Button kind="primary" size="field" renderIcon={Link20}>
              Get Share Link
            </Button>
          )}
        </ToolBarRightWrapper>
      </ToolBarWrapper>
      <Editor
        width="100%"
        height="calc(100vh - 88px)"
        className="editor"
        theme="light"
        language={type.slug}
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
            enabled: true,
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
