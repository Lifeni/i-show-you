import { NotificationKind } from 'carbon-components-react'
import React, { createContext, useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import store from 'store2'
import { validate } from 'uuid'
import { defaultNoticeOptions } from '../utils/global-variable'
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

  const [notice, setNotice] = useState(defaultNoticeOptions)

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
            updated_at: now,
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

          currentPage.setAll({
            token: token,
            created_at: now,
            updated_at: now,
            name: '',
            type: '',
            content: '',
            authentication: 'owner',
            options: {
              auto_save: true,
              word_wrap: false,
              font_family:
                "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace",
              font_size: 14,
              line_height: 22,
              updated_at: now,
            },
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

            currentPage.setAll(
              {
                created_at: data.data.created_at,
                updated_at: data.data.updated_at,
                name: data.data.name,
                type: data.data.type,
                content: data.data.content,
                authentication: data.authentication,
                options: data.data.options,
              },
              true
            )

            setLoading(false)

            if (currentPage.get('options')?.auto_save) {
              await updateFile(id)
            }
          } else if (res.status === 404) {
            if (!currentPage.get('authentication')) {
              setRedirect('404')
            } else {
              setLoading(false)
              setNotice({
                open: true,
                kind: 'warning',
                title: 'Show Local Cache',
                subtitle: 'The file on the server has been deleted.',
              })
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
            setNotice({
              open: true,
              kind: 'warning',
              title: 'Link Lost',
              subtitle: 'The file on the server has been deleted.',
            })
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
    <>
      {loading ? (
        <GlobalLoading />
      ) : (
        <>
          <GlobalNotification
            options={{
              open: notice.open,
              close: () => setNotice({ ...notice, open: false }),
              title: notice.title,
              subtitle: notice.subtitle,
              kind: notice.kind as NotificationKind,
            }}
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
    </>
  )
}

export default App

export { GlobalContext }
