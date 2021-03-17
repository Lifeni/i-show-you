import { ArrowRight20, Home20 } from '@carbon/icons-react'
import {
  Button,
  Form,
  NotificationKind,
  TextInput,
} from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { defaultNoticeOptions } from '../utils/global-variable'
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

const ButtonWrapper = styled.div`
  margin: -16px 0;
  a {
    text-decoration: none;
  }
`

const Admin = () => {
  const [logged, setLogged] = useState(false)
  const [enable, setEnable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [data, setData] = useState([])
  const [date, setDate] = useState(new Date())

  const [notice, setNotice] = useState(defaultNoticeOptions)

  const adminPage = store.namespace('admin-page')

  useEffect(() => {
    setDate(new Date())
    setLoading(true)
    fetch('/api/admin', {
      headers: new Headers({
        Authorization: 'Bearer ' + adminPage.get('token') || 'no-token',
      }),
    }).then(async res => {
      const data = await res.json()
      if (res.status === 200) {
        setLogged(true)
        setData(data.data)
      } else if (res.status === 400) {
        setLogged(false)
        setEnable(false)
      } else {
        setLogged(false)
      }
      setTimeout(() => {
        setLoading(false)
      }, 300)
    })
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
        setNotice({
          open: true,
          kind: 'error',
          title: 'Login Error',
          subtitle: data.message,
        })
      }
    })
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Admin | I Show You</title>
        <meta content={date.getTime().toString()} />
      </Helmet>
      {loading ? (
        <GlobalLoading />
      ) : (
        <>
          {!enable ? (
            <LoginContainer>
              <StyledH1>The Administrator Page is Not Available</StyledH1>
              <ButtonWrapper>
                <Link to="/">
                  <Button kind="ghost" renderIcon={Home20}>
                    Back to Home
                  </Button>
                </Link>
              </ButtonWrapper>
            </LoginContainer>
          ) : logged ? (
            <AdminContainer>
              <StyledH1>
                I Show You <strong>Admin</strong>
              </StyledH1>
              <FileTable data={data} />
            </AdminContainer>
          ) : (
            <LoginContainer>
              <GlobalNotification
                options={{
                  open: notice.open,
                  close: () => setNotice({ ...notice, open: false }),
                  title: notice.title,
                  subtitle: notice.subtitle,
                  kind: notice.kind as NotificationKind,
                }}
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
