import Editor from '@monaco-editor/react'
import { InlineLoading, NotificationKind } from 'carbon-components-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'
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
  const { isMobile, pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)

  const [type, setType] = useState(currentPage.get('type') || '')
  const [value, setValue] = useState(currentPage.get('content') || '')
  const [debouncedValue] = useDebounce(value, 300)

  const [editorId, setEditorId] = useState(new Date().getTime())

  const editorRef = useRef()

  const [autoSave, setAutoSave] = useState(
    currentPage.get('options') ? currentPage.get('options').auto_save : true
  )
  const [wordWrap, setWordWrap] = useState(
    currentPage.get('options') ? currentPage.get('options').word_wrap : false
  )
  const [fontFamily, setFontFamily] = useState(
    currentPage.get('options')
      ? currentPage.get('options').font_family
      : "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace"
  )
  const [fontSize, setFontSize] = useState(
    currentPage.get('options') ? currentPage.get('options').font_size : 14
  )
  const [lineHeight, setLineHeight] = useState(
    currentPage.get('options') ? currentPage.get('options').line_height : 22
  )

  const [status, setStatus] = useState(autoSave ? 'Ready' : 'Auto Save OFF')

  useEffect(() => {
    const updateValue = () => {
      setValue(currentPage.get('content') || '')
      setEditorId(new Date().getTime())

      setAutoSave(
        currentPage.get('options') ? currentPage.get('options').auto_save : true
      )
      setWordWrap(
        currentPage.get('options')
          ? currentPage.get('options').word_wrap
          : false
      )
      setFontFamily(
        currentPage.get('options')
          ? currentPage.get('options').font_family
          : "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace"
      )
      setFontSize(
        currentPage.get('options') ? currentPage.get('options').font_size : 14
      )
      setLineHeight(
        currentPage.get('options') ? currentPage.get('options').line_height : 22
      )

      setStatus(
        currentPage.get('options').auto_save ? 'Ready' : 'Auto Save OFF'
      )
    }

    updateValue()

    window.addEventListener('updateStorage', updateValue, false)

    const save = (e: KeyboardEvent) => {
      if (
        currentPage.get('authentication') === 'owner' &&
        e.ctrlKey &&
        e.key === 's'
      ) {
        e.preventDefault()
        setStatus('Saving')
        fetch(`/api/file/${pageId}`, {
          method: 'PUT',
          body: JSON.stringify({
            updated_at: currentPage.get('updated_at'),
            content: currentPage.get('content'),
            name: currentPage.get('name'),
            type: currentPage.get('type'),
            options: currentPage.get('options'),
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + currentPage.get('token') || 'no-token',
          }),
        }).then(async res => {
          if (res.status === 200) {
            setStatus('Saved')
          } else {
            setStatus('Error')
            setNotificationKind('error')
            setNotificationTitle(`Save Error ${res.status}`)
            setNotificationSubtitle((await res.json()).message)
            setOpenNotification(true)
          }
        })
      }
    }

    window.addEventListener('keydown', save)

    return () => {
      window.removeEventListener('updateStorage', updateValue)
      window.removeEventListener('keydown', save)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  function handleEditorDidMount(_valueGetter: any, editor: any) {
    editorRef.current = editor
    // @ts-ignore
    editorRef.current.onDidChangeModelContent(() => {
      // @ts-ignore
      setValue(editorRef.current.getValue())
    })
  }

  const [openNotification, setOpenNotification] = useState(false)
  const [notificationKind, setNotificationKind] = useState('info')
  const [notificationTitle, setNotificationTitle] = useState(
    'Unknown Notification'
  )
  const [notificationSubtitle, setNotificationSubtitle] = useState(
    'Unknown Notification'
  )

  useEffect(() => {
    if (
      currentPage.get('authentication') === 'owner' &&
      debouncedValue !== currentPage.get('content')
    ) {
      currentPage.set('content', debouncedValue)
      currentPage.set('updated_at', new Date())
      const tabs = store.namespace('tabs')
      const pre = tabs.get(pageId)
      tabs.set(pageId, {
        ...pre,
        updated_at: new Date(),
      })

      if (autoSave) {
        setStatus('Saving')
        fetch(`/api/file/${pageId}/content`, {
          method: 'PATCH',
          body: JSON.stringify({
            updated_at: currentPage.get('updated_at'),
            content: currentPage.get('content'),
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + currentPage.get('token') || 'no-token',
          }),
        }).then(async res => {
          if (res.status === 200) {
            setStatus('Auto Saved')
          } else {
            setStatus('Error')
            setNotificationKind('error')
            setNotificationTitle(`Save Error ${res.status}`)
            setNotificationSubtitle((await res.json()).message)
            setOpenNotification(true)
          }
        })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <Wrapper>
      <GlobalNotification
        open={openNotification}
        close={() => setOpenNotification(false)}
        title={notificationTitle}
        subtitle={notificationSubtitle}
        kind={notificationKind as NotificationKind}
      />
      <ToolBar editor={editorRef} status={status} updateType={setType} />
      <Editor
        width="100%"
        height="calc(100vh - 88px)"
        className="editor"
        theme="light"
        language={type}
        loading={
          <LoadingWrapper>
            <InlineLoading description="Editor Loading ..." />
          </LoadingWrapper>
        }
        value={value}
        options={{
          wordWrap: wordWrap ? 'on' : 'off',
          fontFamily: fontFamily,
          fontSize: fontSize,
          lineHeight: lineHeight,
          padding: {
            top: 16,
            bottom: 16,
          },
          minimap: {
            enabled: !isMobile,
            scale: 1,
            maxColumn: 150,
          },
          readOnly: currentPage.get('authentication') !== 'owner',
        }}
        editorDidMount={handleEditorDidMount}
      />
    </Wrapper>
  )
}

export default TextEditor
