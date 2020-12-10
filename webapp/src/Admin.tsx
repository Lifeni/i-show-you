import { ArrowRight20 } from '@carbon/icons-react'
import { Button, Form, TextInput } from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import store from 'store2'
import styled from 'styled-components'

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

const StyledH1 = styled.h1`
  font-size: 1.25rem;
`

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`

const Admin = () => {
  const [logged, setLogged] = useState(false)
  const adminPage = store.namespace('admin-page')
  useEffect(() => {
    if (adminPage.has('token')) {
      // fetch admin access
      setLogged(true)
    }
  }, [adminPage])

  return (
    <HelmetProvider>
      <Helmet>
        <title>Admin | I Show You</title>
      </Helmet>
      {logged ? (
        <h1>Welcome</h1>
      ) : (
        <LoginContainer>
          <StyledH1>
            I Show You <strong>Admin</strong>
          </StyledH1>
          <Form>
            <LoginWrapper>
              <TextInput
                id="admin-password"
                labelText="Input Admin Password"
                hideLabel
                type="password"
                placeholder="Password"
                autoFocus
                autoComplete="off"
              />
              <Button
                hasIconOnly
                renderIcon={ArrowRight20}
                tooltipAlignment="center"
                tooltipPosition="bottom"
                iconDescription="Login"
                size="field"
              />
            </LoginWrapper>
          </Form>
        </LoginContainer>
      )}
    </HelmetProvider>
  )
}

export default Admin
