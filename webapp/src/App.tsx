import { Loading, ToastNotification } from 'carbon-components-react'
import React, { createContext, useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Redirect, useParams } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { validate } from 'uuid'
import HeaderBar from './components/HeaderBar'
import TextEditor from './components/TextEditor'

const context: IGlobalData = {
  isMobile: false,
  pageId: 'local-file',
}

const GlobalContext = createContext(context)

const NotificationWrapper = styled.div`
  position: fixed;
  z-index: 99998;
  top: 48px;
  right: 0;
`

const LoadingWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;

  svg {
    transform: scale(0.5);
  }
`

const App = () => {
  const [message, setMessage] = useState(false)
  const [notification, setNotification] = useState({
    status: 0,
    statusText: '',
    message: '',
    documentation: '',
  })
  const [loading, setLoading] = useState(true)
  const [redirect, setRedirect] = useState(false)

  const { id }: IURLParams = useParams()
  const [pageId, setPageId] = useState(id || 'local-file')

  useEffect(() => {
    setPageId(id || 'local-file')
    if (id) {
      if (validate(id)) {
        const currentPage = store.namespace(id)
        if (!currentPage.has('token')) {
          fetch(`/api/file/${id}`).then(async res => {
            const data = await res.json()
            setLoading(false)
            if (res.status === 200) {
              // currentPage.add('remote', data)
            } else if (res.status === 404) {
              setRedirect(true)
            } else {
              setNotification({
                status: res.status,
                statusText: res.statusText,
                message: data.message,
                documentation: data.documentation,
              })
            }
          })
        } else {
          setLoading(false)
        }
      } else {
        setRedirect(true)
      }
    } else {
      setLoading(false)
      const tabs = store.namespace('tabs')
      const currentPage = store.namespace('local-file')
      if (!currentPage.get('created-at')) {
        const date = new Date()
        tabs.set(
          'local-file',
          JSON.stringify({
            name: 'Untitled File',
            created_at: date,
            id: 'local-file',
          })
        )
        currentPage.set('token', '')
        currentPage.set('created-at', date, false)
        currentPage.set('updated-at', date)
        currentPage.set('name', '')
        currentPage.set('type', '')
        currentPage.set('content', '')
        currentPage.set('line', '')
      }
    }
  }, [id])

  let isMobile = false

  window.addEventListener('DOMContentLoaded', () => {
    isMobile = window.innerWidth < 720
  })

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(() => {
      isMobile = window.innerWidth < 720
    })
  })

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {store.namespace(pageId).get('name') || 'Untitled File'} | I Show You
        </title>
      </Helmet>
      {loading ? (
        <LoadingWrapper>
          <Loading description="Loading ..." withOverlay={false} />
        </LoadingWrapper>
      ) : (
        <GlobalContext.Provider value={{ isMobile: isMobile, pageId: pageId }}>
          <HeaderBar />
          <TextEditor />
        </GlobalContext.Provider>
      )}
      {redirect && <Redirect to={{ pathname: '/404' }} />}
      {message && (
        <NotificationWrapper>
          <ToastNotification
            title={notification.message}
            onCloseButtonClick={() => setMessage(false)}
          />
        </NotificationWrapper>
      )}
    </HelmetProvider>
  )
}

export default App

export { GlobalContext }
