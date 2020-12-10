import { TextInput } from 'carbon-components-react'
import React, { MutableRefObject, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { findByExt, findBySlug } from '../utils/identify-file-type'
import FileHistory from './FileHistory'
import FileMeta from './FileMeta'
import FileOption from './FileOption'
import RemoveFile from './RemoveFile'
import RunFile from './RunFile'
import ShareFile from './ShareFile'
import { GlobalContext } from '../App'

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
  editor: MutableRefObject<undefined>
  updateType: Function
}) => {
  const { editor, updateType } = props
  const { isMobile } = useContext(GlobalContext)

  const { id }: IURLParams = useParams()
  const currentPage = store.namespace(id || 'local-file')

  const [type, setType] = useState(currentPage.get('type'))
  const [name, setName] = useState(currentPage.get('name'))
  const [debouncedType] = useDebounce(type, 500)
  const [debouncedName] = useDebounce(name, 500)

  const changeLanguage = (e: { target: { value: string } }) => {
    setName(e.target.value)
    const arr = e.target.value.split('.')
    if (e.target.value.includes('.') && arr.length > 0) {
      const lang = findByExt(arr[arr.length - 1])
      setType(lang.slug)
      updateType(lang.slug)
    }
  }

  useEffect(() => {
    currentPage.set('type', debouncedType)
  }, [currentPage, debouncedType])

  useEffect(() => {
    currentPage.set('name', debouncedName)
  }, [currentPage, debouncedName])

  const focusEditor = (e: { code: string }) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      // @ts-ignore
      editor.current?.focus()
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (currentPage.get('name') !== '') {
      setTimeout(() => {
        // @ts-ignore
        editor.current?.focus()
      }, 500)
    } else {
      setTimeout(() => {
        const input: HTMLInputElement | null = document.querySelector(
          '#editor-file-name'
        )
        input?.focus()
      }, 500)
    }
  })

  return (
    <ToolBarWrapper>
      <ToolBarLeftWrapper className="fixed-width">
        {!isMobile && <FileMeta type={findBySlug(type)} />}
        <FileOption />
        <FileHistory />
        {!isMobile && <RemoveFile />}
      </ToolBarLeftWrapper>
      <ToolBarCenterWrapper>
        <TextInput
          labelText=""
          placeholder="Untitled"
          onChange={changeLanguage}
          onKeyPress={focusEditor}
          defaultValue={!!name ? name : ''}
          autoComplete="off"
          aria-autocomplete="none"
          autoFocus
          className="styled-input"
          id="editor-file-name"
        />
      </ToolBarCenterWrapper>
      <ToolBarRightWrapper className="fixed-width">
        {!isMobile && <RunFile type={findBySlug(type)} />}
        {isMobile && <RemoveFile />}
        <ShareFile />
      </ToolBarRightWrapper>
    </ToolBarWrapper>
  )
}

export default ToolBar
