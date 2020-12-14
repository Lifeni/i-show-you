import { TextInput } from 'carbon-components-react'
import React, { MutableRefObject, useContext, useEffect, useState } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { GlobalContext } from '../App'
import { findByExt, findBySlug } from '../utils/identify-file-type'
import FileHistory from './FileHistory'
import FileMeta from './FileMeta'
import FileOption from './FileOption'
import RemoveFile from './RemoveFile'
import RunFile from './RunFile'
import ShareFile from './ShareFile'

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
  const { isMobile, pageId } = useContext(GlobalContext)

  const currentPage = store.namespace(pageId)
  const tabs = store.namespace('tabs')

  const [type, setType] = useState(currentPage.get('type') || '')
  const [name, setName] = useState(currentPage.get('name') || '')
  const [debouncedType] = useDebounce(type, 300)
  const [debouncedName] = useDebounce(name, 300)

  const changeLanguage = (e: { target: { value: string } }) => {
    setName(e.target.value)
    tabs.set(
      pageId,
      JSON.stringify({
        name: e.target.value,
        created_at: store.namespace(pageId).get('created-at'),
        id: pageId,
      })
    )
    window.dispatchEvent(new Event('storage'))
    const arr = e.target.value.split('.')
    if (e.target.value.includes('.') && arr.length > 0) {
      const lang = findByExt(arr[arr.length - 1])
      setType(lang.slug)
      updateType(lang.slug)
    }
  }

  useEffect(() => {
    currentPage.set('name', debouncedName)
    currentPage.set('updated-at', new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName])

  useEffect(() => {
    currentPage.set('type', debouncedType)
    currentPage.set('updated-at', new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedType])

  useEffect(() => {
    setName(currentPage.get('name') || '')
    setType(currentPage.get('type') || '')
    updateType(currentPage.get('type') || '')
    const input: HTMLInputElement | null = document.querySelector(
      '#editor-file-name'
    )
    if (input) {
      input.value = currentPage.get('name') || ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  const focusEditor = (e: { code: string }) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      // @ts-ignore
      editor.current?.focus()
    }
  }

  const focusToolBar = () => {
    const input: HTMLInputElement | null = document.querySelector(
      '#editor-file-name'
    )
    input?.focus()
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (currentPage.get('name') === '') {
      setTimeout(() => {
        focusToolBar()
      }, 500)
    }
  })

  return (
    <ToolBarWrapper>
      <ToolBarLeftWrapper className="fixed-width">
        {!isMobile && <FileMeta type={findBySlug(type)} />}
        <FileOption />
        <FileHistory />
        {!isMobile && currentPage.get('authentication') === 'owner' && (
          <RemoveFile />
        )}
      </ToolBarLeftWrapper>
      <ToolBarCenterWrapper>
        <TextInput
          labelText=""
          placeholder="Untitled"
          onChange={changeLanguage}
          onKeyPress={focusEditor}
          defaultValue={name}
          title={name}
          autoComplete="off"
          maxLength={32}
          aria-autocomplete="none"
          autoFocus
          readOnly={currentPage.get('authentication') !== 'owner'}
          className="styled-input"
          id="editor-file-name"
        />
      </ToolBarCenterWrapper>
      <ToolBarRightWrapper className="fixed-width">
        {!isMobile && <RunFile type={findBySlug(type)} />}
        {isMobile && currentPage.get('authentication') === 'owner' && (
          <RemoveFile />
        )}
        <ShareFile />
      </ToolBarRightWrapper>
    </ToolBarWrapper>
  )
}

export default ToolBar
