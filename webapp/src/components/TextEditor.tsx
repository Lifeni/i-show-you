import Editor from '@monaco-editor/react'
import { InlineLoading, NotificationKind } from 'carbon-components-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { GlobalContext } from '../App'
import GlobalNotification from './GlobalNotification'
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

  const [status, setStatus] = useState('Ready')

  const editorRef = useRef()

  useEffect(() => {
    setValue(currentPage.get('content') || '')
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
    if (debouncedValue !== currentPage.get('content')) {
      currentPage.set('content', debouncedValue)
      currentPage.set('updated-at', new Date())
      const tabs = store.namespace('tabs')
      const pre = tabs.get(pageId)
      tabs.set(
        pageId,
        JSON.stringify({
          ...JSON.parse(pre),
          updated_at: new Date(),
        })
      )
      setStatus('Saving')
      fetch(`/api/file/${pageId}/content`, {
        method: 'PATCH',
        body: JSON.stringify({
          updated_at: currentPage.get('updated-at'),
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
          readOnly: currentPage.get('authentication') !== 'owner',
        }}
        editorDidMount={handleEditorDidMount}
      />
    </Wrapper>
  )
}

export default TextEditor
