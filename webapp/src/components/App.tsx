import { NotificationKind } from 'carbon-components-react'
import React, { createContext, useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Redirect, useParams } from 'react-router-dom'
import store from 'store2'
import { validate } from 'uuid'
import { isMobile as check } from '../utils/is-mobile'
import { closeUpdate, updateFile } from '../utils/update-file'
import HeaderBar from './app/layout/HeaderBar'
import TextEditor from './app/layout/TextEditor'
import GlobalLoading from './global/GlobalLoading'
import GlobalNotification from './global/GlobalNotification'
import { MobileTips } from './global/MobileTips'

const context: IGlobalData = {
  isMobile: false,
  pageId: '',
}

const GlobalContext = createContext(context)

const App = () => {
  const [loading, setLoading] = useState(true)
  const [redirect, setRedirect] = useState('200')

  const { id }: IURLParams = useParams()
  const [pageId, setPageId] = useState(id)

  const [openNotification, setOpenNotification] = useState(false)
  const [notificationKind, setNotificationKind] = useState('info')
  const [notificationTitle, setNotificationTitle] = useState(
    'Unknown Notification'
  )
  const [notificationSubtitle, setNotificationSubtitle] = useState(
    '只是一个通知占位符。'
  )

  useEffect(() => {
    setPageId(id)
    closeUpdate()
    if (id === 'new') {
      const now = new Date()
      fetch('/api/file', {
        method: 'POST',
        body: JSON.stringify({
          created_at: now,
          updated_at: now,
          name: '',
          type: '',
          content: '',
          options: {
            auto_save: true,
            word_wrap: false,
            font_family:
              "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace",
            font_size: 14,
            line_height: 22,
          },
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(async res => {
        if (res.ok) {
          const data = (await res.json()).data
          const uuid = data.id
          const token = data.token
          const tabs = store.namespace('tabs')
          const currentPage = store.namespace(uuid)
          tabs.set(uuid, {
            name: '',
            created_at: now,
            updated_at: now,
            id: uuid,
            authentication: 'owner',
          })
          currentPage.set('token', token)
          currentPage.set('created_at', now, false)
          currentPage.set('updated_at', now)
          currentPage.set('name', '')
          currentPage.set('type', '')
          currentPage.set('content', '')
          currentPage.set('authentication', 'owner')
          currentPage.set('options', {
            auto_save: true,
            word_wrap: false,
            font_family:
              "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace",
            font_size: 14,
            line_height: 22,
          })
          setRedirect(uuid)
          setLoading(false)
        } else {
          setRedirect('500')
        }
      })
    } else if (validate(id)) {
      const currentPage = store.namespace(id)
      if (currentPage.get('authentication') !== 'owner') {
        fetch(`/api/file/${id}`, {
          headers: new Headers({
            Authorization: 'Bearer ' + currentPage.get('token') || 'no-token',
          }),
        }).then(async res => {
          const data = await res.json()
          if (res.status === 200) {
            const tabs = store.namespace('tabs')
            tabs.set(id, {
              name: data.data.name,
              created_at: data.data.created_at,
              updated_at: data.data.updated_at,
              id: id,
              authentication: data.authentication,
            })

            currentPage.set('created_at', data.data.created_at, true)
            currentPage.set('updated_at', data.data.updated_at, true)
            currentPage.set('name', data.data.name, true)
            currentPage.set('type', data.data.type, true)
            currentPage.set('content', data.data.content, true)
            currentPage.set('authentication', data.authentication, true)
            currentPage.set('options', data.data.options)
            setLoading(false)

            if (currentPage.get('options').auto_save) {
              await updateFile(id)
            }
          } else if (res.status === 404) {
            if (!currentPage.get('authentication')) {
              setRedirect('404')
            } else {
              setLoading(false)
              setNotificationKind('warning')
              setNotificationTitle(`Show Local Cache`)
              setNotificationSubtitle(
                'The file on the server has been deleted.'
              )
              setOpenNotification(true)
            }
          } else {
            setRedirect('500')
          }
        })
      } else {
        fetch(`/api/file/${id}`, {
          headers: new Headers({
            Authorization: 'Bearer ' + currentPage.get('token') || 'no-token',
          }),
        }).then(async res => {
          setLoading(false)
          if (res.status === 404) {
            currentPage.set('token', '', true)
            setNotificationKind('warning')
            setNotificationTitle(`Link Lost`)
            setNotificationSubtitle('The file on the server has been deleted.')
            setOpenNotification(true)
          }
        })
      }
    } else {
      setRedirect('404')
    }
  }, [id])

  const [isMobile, setMobile] = useState(false)
  useEffect(() => {
    const checkWidth = () => {
      window.requestAnimationFrame(() => {
        setMobile(check)
      })
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)

    return () => {
      window.removeEventListener('resize', checkWidth)
    }
  }, [id])

  return (
    <HelmetProvider>
      {loading ? (
        <>
          <Helmet>
            <title>I Show You</title>
          </Helmet>
          <GlobalLoading />
        </>
      ) : (
        <>
          <GlobalNotification
            open={openNotification}
            close={() => setOpenNotification(false)}
            title={notificationTitle}
            subtitle={notificationSubtitle}
            kind={notificationKind as NotificationKind}
          />
          <GlobalContext.Provider
            value={{ isMobile: isMobile, pageId: pageId }}
          >
            <HeaderBar noNav={false} />
            {isMobile &&
            store.namespace(pageId).get('authentication') === 'owner' ? (
              <MobileTips />
            ) : null}
            <TextEditor />
          </GlobalContext.Provider>
        </>
      )}
      {redirect !== '200' && <Redirect to={{ pathname: redirect }} />}
    </HelmetProvider>
  )
}

export default App

export { GlobalContext }
