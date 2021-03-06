import { NotificationKind, Tag, TextInput } from 'carbon-components-react'
import React, { MutableRefObject, useContext, useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import store from 'store2'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { findByExt, findBySlug } from '../../../utils/check-file-type'
import { defaultNoticeOptions } from '../../../utils/global-variable'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'
import HorizontalScroller from '../../global/HorizontalScroller'
import FileHistory from '../tool-bar/FileHistory'
import FileMeta from '../tool-bar/FileMeta'
import FileOption from '../tool-bar/FileOption'
import ForkFile from '../tool-bar/ForkFile'
import RemoveFile from '../tool-bar/RemoveFile'
import RunFile from '../tool-bar/RunFile'
import ViewLink from '../tool-bar/ViewLink'

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
  width: 100%;
  max-width: calc(100vw - 160px);
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

const NameLabel = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
  margin: 0 auto;
`

const ToolBar = (props: {
  editor: MutableRefObject<undefined>
  status: string
  updateType: Function
  updateView: Function
}) => {
  const { editor, status, updateType, updateView } = props
  const { isMobile, pageId } = useContext(GlobalContext)

  const currentPage = store.namespace(pageId)
  const tabs = store.namespace('tabs')

  const [type, setType] = useState(currentPage.get('type') || '')
  const [name, setName] = useState(currentPage.get('name') || '')
  const [debouncedType] = useDebounce(type, 300)
  const [debouncedName] = useDebounce(name, 300)

  const [reRender, setReRender] = useState(0)

  const changeLanguage = (e: { target: { value: string } }) => {
    setName(e.target.value)
    tabs.set(pageId, {
      name: e.target.value,
      created_at: store.namespace(pageId).get('created_at'),
      updated_at: store.namespace(pageId).get('updated_at'),
      id: pageId,
      authentication: store.namespace(pageId).get('authentication'),
    })
    window.dispatchEvent(new Event('updateFileEvent'))
    const arr = e.target.value.split('.')
    if (e.target.value.includes('.') && arr.length > 0) {
      const lang = findByExt(arr[arr.length - 1])
      setType(lang.slug)
      updateType(lang.slug)
    }
  }

  const [fileStatus, setFileStatus] = useState(status)
  const [notice, setNotice] = useState(defaultNoticeOptions)

  useEffect(() => {
    setFileStatus(status)
  }, [status])

  useEffect(() => {
    if (
      currentPage.get('authentication') === 'owner' &&
      (debouncedName !== currentPage.get('name') ||
        debouncedType !== currentPage.get('type'))
    ) {
      currentPage.set('name', debouncedName)
      currentPage.set('type', debouncedType)
      updateType(debouncedType)

      currentPage.set('updated_at', new Date())
      const pre = tabs.get(pageId)
      tabs.set(pageId, {
        ...pre,
        name: debouncedName,
        updated_at: new Date(),
      })

      if (
        currentPage.get('token') !== '' &&
        currentPage.get('options')?.auto_save
      ) {
        setFileStatus('Saving')
        fetch(`/api/file/${pageId}/name`, {
          method: 'PATCH',
          body: JSON.stringify({
            updated_at: currentPage.get('updated_at'),
            name: currentPage.get('name'),
            type: currentPage.get('type'),
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + currentPage.get('token') || 'no-token',
          }),
        }).then(async res => {
          if (res.status === 200) {
            setFileStatus('Auto Saved')
          } else {
            setFileStatus('Error')
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
  }, [debouncedName])

  useEffect(() => {
    setName(currentPage.get('name') || '')
    setType(currentPage.get('type') || '')
    updateType(currentPage.get('type') || '')

    if (currentPage.get('authentication') !== 'owner') {
      const updateValue = () => {
        setName(currentPage.get('name') || '')
        setType(currentPage.get('type') || '')
        updateType(currentPage.get('type') || '')
      }

      window.addEventListener('updateFileEvent', updateValue, false)
      return () => {
        window.removeEventListener('updateFileEvent', updateValue)
      }
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

  useEffect(() => {
    if (currentPage.get('name') === '') {
      setTimeout(() => {
        focusToolBar()
      }, 500)
    } else {
      setTimeout(() => {
        // @ts-ignore
        editor.current?.focus()
      }, 500)
    }
  }, [currentPage, editor])

  return (
    <HelmetProvider>
      <Helmet>
        <title>{name || 'Untitled File'}</title>
      </Helmet>
      <GlobalNotification
        options={{
          open: notice.open,
          close: () => setNotice({ ...notice, open: false }),
          title: notice.title,
          subtitle: notice.subtitle,
          kind: notice.kind as NotificationKind,
        }}
      />
      <ToolBarWrapper>
        <ToolBarLeftWrapper className="fixed-width">
          {!isMobile && (
            <FileMeta status={fileStatus} type={findBySlug(type)} />
          )}
          <FileOption />
          <FileHistory />
          {!isMobile && (
            <RemoveFile reRender={() => setReRender(reRender + 1)} />
          )}
        </ToolBarLeftWrapper>
        <ToolBarCenterWrapper>
          {currentPage.get('authentication') === 'owner' ? (
            <TextInput
              labelText=""
              placeholder="Untitled"
              onChange={changeLanguage}
              onKeyPress={focusEditor}
              value={name}
              title={name}
              autoComplete="off"
              maxLength={100}
              aria-autocomplete="none"
              autoFocus
              readOnly={currentPage.get('authentication') !== 'owner'}
              className="styled-input"
              id="editor-file-name"
            />
          ) : (
            <HorizontalScroller>
              <NameLabel>
                {isMobile && <Tag type="blue">Read Only</Tag>}
                {name || 'Untitled'}
              </NameLabel>
            </HorizontalScroller>
          )}
        </ToolBarCenterWrapper>
        <ToolBarRightWrapper className="fixed-width">
          {!isMobile && (
            <RunFile type={findBySlug(type)} updateView={updateView} />
          )}
          {!isMobile && <ForkFile />}
          {isMobile && (
            <RemoveFile reRender={() => setReRender(reRender + 1)} />
          )}
          <ViewLink />
        </ToolBarRightWrapper>
      </ToolBarWrapper>
    </HelmetProvider>
  )
}

export default ToolBar
