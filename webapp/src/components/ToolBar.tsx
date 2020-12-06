import { Link20 } from '@carbon/icons-react'
import { Button, TextInput } from 'carbon-components-react'
import React, { MutableRefObject } from 'react'
import styled from 'styled-components'
import { findLanguage } from '../utils/identify-file-type'
import FileHistory from './FileHistory'
import FileMeta from './FileMeta'
import FileOption from './FileOption'
import RemoveFile from './RemoveFile'
import RunFile from './RunFile'

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

const ToolBar = (props: {
  mobile: boolean
  editor: MutableRefObject<undefined>
  type: IFileMap
  setType: Function
}) => {
  const { mobile, editor, type, setType } = props

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
      editor.current?.focus()
    }
  }

  return (
    <ToolBarWrapper>
      <ToolBarLeftWrapper className="fixed-width">
        <FileMeta mobile={mobile} type={type} />
        <FileOption />
        <FileHistory />
        <RunFile mobile={mobile} type={type} />
      </ToolBarLeftWrapper>
      <ToolBarCenterWrapper>
        <TextInput
          labelText=""
          placeholder="Untitled"
          onChange={changeLanguage}
          onKeyPress={focusEditor}
          autoComplete="off"
          aria-autocomplete="none"
          id="editor-file-name"
        />
      </ToolBarCenterWrapper>
      <ToolBarRightWrapper className="fixed-width">
        <RemoveFile />
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
  )
}

export default ToolBar
