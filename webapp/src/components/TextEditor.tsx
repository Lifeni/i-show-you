import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button, TextInput } from 'carbon-components-react'
import {
  Link20,
  RecentlyViewed20,
  SettingsAdjust20,
  TrashCan20,
} from '@carbon/icons-react'

import styled from 'styled-components'

import './TextEditor.css'

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
  const [type, setType] = useState('Markdown')
  const [mobile, setMobile] = useState(false)

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
      <ToolBarWrapper>
        <ToolBarLeftWrapper className="fixed-width">
          {!mobile && (
            <Button kind="ghost" size="field">
              Local File in Browser
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
        language={type.toLowerCase()}
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
      />
    </Wrapper>
  )
}

export default TextEditor
