import Editor from '@monaco-editor/react'
import { InlineLoading, NotificationKind } from 'carbon-components-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import {
  defaultFileOptions,
  defaultNoticeOptions,
} from '../../../utils/global-variable'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'
import MarkdownPreview from '../text-editor/MarkdownPreview'
import WebBrowser from '../text-editor/WebBrowser'
import ToolBar from './ToolBar'

const Wrapper = styled.div`
  overflow: hidden;
`

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 88px);
  display: flex;
`

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const TextEditor = () => {
  const { isMobile, pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)

  const [view, setView] = useState('none')
  const [type, setType] = useState(currentPage.get('type') || '')
  const [value, setValue] = useState(currentPage.get('content') || '')
  const [debouncedValue] = useDebounce(value, 300)

  const editorRef = useRef()

  const [options, setOptions] = useState(
    currentPage.get('options') || defaultFileOptions
  )

  const [status, setStatus] = useState(
    options.auto_save ? 'Ready' : 'Auto Save OFF'
  )

  useEffect(() => {
    setView('none')

    const updateValue = () => {
      setValue(currentPage.get('content') || '')
      setOptions(currentPage.get('options') || defaultFileOptions)
      setStatus(options.auto_save ? 'Ready' : 'Auto Save OFF')
    }

    updateValue()

    const uploadEntireFile = (e: KeyboardEvent) => {
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
            setNotice({
              open: true,
              kind: 'error',
              title: `Save Error ${res.status}`,
              subtitle: (await res.json()).message,
            })
          }
        })
      }
    }

    window.addEventListener('updateFileEvent', updateValue, false)
    window.addEventListener('keydown', uploadEntireFile)

    return () => {
      window.removeEventListener('updateFileEvent', updateValue)
      window.removeEventListener('keydown', uploadEntireFile)
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

  const [notice, setNotice] = useState(defaultNoticeOptions)

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

      if (currentPage.get('token') !== '' && options.auto_save) {
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
            window.dispatchEvent(new Event('updateViewEvent'))
          } else {
            setStatus('Error')
            setNotice({
              open: true,
              kind: 'error',
              title: `Save Error ${res.status}`,
              subtitle: (await res.json()).message,
            })
          }
        })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <Wrapper>
      <GlobalNotification
        options={{
          open: notice.open,
          close: () => setNotice({ ...notice, open: false }),
          title: notice.title,
          subtitle: notice.subtitle,
          kind: notice.kind as NotificationKind,
        }}
      />
      <ToolBar
        editor={editorRef}
        status={status}
        updateType={setType}
        updateView={setView}
      />
      <Container>
        <Editor
          width={view === 'none' ? '100%' : '50%'}
          height="100%"
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
            wordWrap: options.word_wrap ? 'on' : 'off',
            fontFamily: options.font_family,
            fontSize: options.font_size,
            lineHeight: options.line_height,
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
          key={pageId}
        />

        {view === 'html' ? (
          <WebBrowser />
        ) : view === 'markdown' ? (
          <MarkdownPreview />
        ) : null}
      </Container>
    </Wrapper>
  )
}

export default TextEditor
