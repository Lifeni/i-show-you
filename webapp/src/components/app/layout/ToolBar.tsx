import { NotificationKind, Tag, TextInput } from 'carbon-components-react'
import React, { MutableRefObject, useContext, useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import store from 'store2'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { findByExt, findBySlug } from '../../../utils/check-file-type'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'
import FileHistory from '../toolbar/FileHistory'
import FileMeta from '../toolbar/FileMeta'
import FileOption from '../toolbar/FileOption'
import RemoveFile from '../toolbar/RemoveFile'
import RunFile from '../toolbar/RunFile'
import ViewLink from '../toolbar/ViewLink'

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

const NameLabel = styled.div`
  display: flex;
  align-items: center;
`

const ToolBar = (props: {
  editor: MutableRefObject<undefined>
  status: string
  updateType: Function
}) => {
  const { editor, status, updateType } = props
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
    tabs.set(
      pageId,
      JSON.stringify({
        name: e.target.value,
        created_at: store.namespace(pageId).get('created-at'),
        updated_at: store.namespace(pageId).get('updated-at'),
        id: pageId,
        authentication: store.namespace(pageId).get('authentication'),
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

  const [fileStatus, setFileStatus] = useState(status)
  const [openNotification, setOpenNotification] = useState(false)
  const [notificationKind, setNotificationKind] = useState('info')
  const [notificationTitle, setNotificationTitle] = useState(
    'Unknown Notification'
  )
  const [notificationSubtitle, setNotificationSubtitle] = useState(
    'Unknown Notification'
  )

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
      currentPage.set('updated-at', new Date())
      const pre = tabs.get(pageId)
      tabs.set(
        pageId,
        JSON.stringify({
          ...JSON.parse(pre),
          name: debouncedName,
          updated_at: new Date(),
        })
      )
      setFileStatus('Saving')
      fetch(`/api/file/${pageId}/name`, {
        method: 'PATCH',
        body: JSON.stringify({
          updated_at: currentPage.get('updated-at'),
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
          setNotificationKind('error')
          setNotificationTitle(`Save Error ${res.status}`)
          setNotificationSubtitle((await res.json()).message)
          setOpenNotification(true)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, debouncedType])

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

    if (currentPage.get('authentication') !== 'owner') {
      const updateValue = () => {
        setName(currentPage.get('name') || '')
        setType(currentPage.get('type') || '')
        updateType(currentPage.get('type') || '')
        if (input) {
          input.value = currentPage.get('name') || ''
        }
      }

      window.addEventListener('updateStorage', updateValue, false)
      return () => {
        window.removeEventListener('updateStorage', updateValue)
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
        open={openNotification}
        close={() => setOpenNotification(false)}
        title={notificationTitle}
        subtitle={notificationSubtitle}
        kind={notificationKind as NotificationKind}
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
              defaultValue={name}
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
            <NameLabel>
              {isMobile && <Tag type="blue">Read Only</Tag>}
              {name || 'Untitled'}
            </NameLabel>
          )}
        </ToolBarCenterWrapper>
        <ToolBarRightWrapper className="fixed-width">
          {!isMobile && <RunFile type={findBySlug(type)} />}
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
