import { Loading, ToastNotification } from 'carbon-components-react'
import React, { createContext, useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { validate } from 'uuid'
import HeaderBar from './components/HeaderBar'
import TextEditor from './components/TextEditor'

const context: IGlobalData = {
  isMobile: false,
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

  useEffect(() => {
    if (id) {
      if (validate(id)) {
        const currentPage = store.namespace(id)
        if (!currentPage.has('token')) {
          fetch(`/api/file/${id}`).then(async res => {
            const data = await res.json()
            setLoading(false)
            if (res.status === 200) {
              currentPage.add('remote', data)
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
      const currentPage = store.namespace('local-file')
      currentPage.add('token', '')
      currentPage.add('name', '')
      currentPage.add('type', '')
      currentPage.add('content', '')
    }
  }, [id])

  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 720)
    }

    checkMobile()

    window.addEventListener('resize', () => {
      window.requestAnimationFrame(() => {
        checkMobile()
      })
    })
  }, [isMobile])

  return (
    <>
      {loading ? (
        <LoadingWrapper>
          <Loading description="Loading ..." withOverlay={false} />
        </LoadingWrapper>
      ) : (
        <GlobalContext.Provider value={{ isMobile: isMobile }}>
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
    </>
  )
}

export default App

export { GlobalContext }
