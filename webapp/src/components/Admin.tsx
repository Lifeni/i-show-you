import { ArrowRight20 } from '@carbon/icons-react'
import {
  Button,
  Form,
  NotificationKind,
  TextInput,
} from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import store from 'store2'
import styled from 'styled-components'
import FileTable from './admin/FileTable'
import GlobalLoading from './global/GlobalLoading'
import GlobalNotification from './global/GlobalNotification'

const LoginContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: none;
  gap: 24px;
`

const AdminContainer = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`

const StyledH1 = styled.h1`
  font-size: 1.25rem;
  padding: 8px;
`

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`

const Admin = () => {
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [data, setData] = useState([])

  const [openNotification, setOpenNotification] = useState(false)
  const [notificationKind, setNotificationKind] = useState('info')
  const [notificationTitle, setNotificationTitle] = useState(
    'Unknown Notification'
  )
  const [notificationSubtitle, setNotificationSubtitle] = useState(
    '只是一个通知占位符。'
  )

  const adminPage = store.namespace('admin-page')

  useEffect(() => {
    setLoading(true)
    if (adminPage.has('token')) {
      fetch('/api/admin', {
        headers: new Headers({
          Authorization: 'Bearer ' + adminPage.get('token') || 'no-token',
        }),
      }).then(async res => {
        const data = await res.json()
        if (res.status === 200) {
          setLogged(true)
          setData(data.data)
          // console.log(data.data)
        } else {
          setLogged(false)
        }
        setLoading(false)
      })
    } else {
      setLogged(false)
      setPassword('')
      setLoading(false)
    }
  }, [adminPage])

  const handleLogin = () => {
    fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify({
        password: password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(async res => {
      const data = await res.json()
      if (res.status === 200) {
        adminPage.set('token', data.data.token)
        setLogged(true)
        setPassword('')

        setLoading(true)
        await fetch('/api/admin', {
          headers: new Headers({
            Authorization: 'Bearer ' + adminPage.get('token') || 'no-token',
          }),
        }).then(async res => {
          const data = await res.json()
          if (res.status === 200) {
            setData(data.data)
          }
          setTimeout(() => {
            setLoading(false)
          }, 300)
        })
      } else {
        setLoading(false)
        setNotificationKind('error')
        setNotificationTitle(`Login Error`)
        setNotificationSubtitle(data.message)
        setOpenNotification(true)
      }
    })
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Admin | I Show You</title>
      </Helmet>
      {loading ? (
        <GlobalLoading />
      ) : (
        <>
          {logged ? (
            <AdminContainer>
              <StyledH1>
                I Show You <strong>Admin</strong>
              </StyledH1>
              <FileTable data={data} />
            </AdminContainer>
          ) : (
            <LoginContainer>
              <GlobalNotification
                open={openNotification}
                close={() => setOpenNotification(false)}
                title={notificationTitle}
                subtitle={notificationSubtitle}
                kind={notificationKind as NotificationKind}
              />
              <StyledH1>
                I Show You <strong>Admin</strong>
              </StyledH1>
              <Form>
                <LoginWrapper>
                  <TextInput.PasswordInput
                    id="admin-password"
                    labelText="Login"
                    hideLabel
                    placeholder="Password"
                    autoFocus
                    autoComplete="off"
                    onChange={e => setPassword(e.target.value)}
                    onKeyPress={e => {
                      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                        e.preventDefault()
                        handleLogin()
                      }
                    }}
                  />
                  <Button
                    hasIconOnly
                    renderIcon={ArrowRight20}
                    tooltipAlignment="center"
                    tooltipPosition="bottom"
                    iconDescription="Login"
                    size="field"
                    onClick={e => {
                      e.preventDefault()
                      handleLogin()
                    }}
                    disabled={loading}
                  />
                </LoginWrapper>
              </Form>
            </LoginContainer>
          )}
        </>
      )}
    </HelmetProvider>
  )
}

export default Admin
