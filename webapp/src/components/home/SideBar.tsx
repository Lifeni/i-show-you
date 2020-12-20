import {
  BookmarkFilled16,
  CloseFilled16,
  FlagFilled16,
  InformationFilled16,
  LogoGithub16,
  StarFilled16,
  UserAvatarFilled16,
} from '@carbon/icons-react'
import {
  Switcher,
  SwitcherDivider,
  SwitcherItem,
} from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Link, LinkProps, useLocation } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import packageFile from '../../../package.json'

const Container = styled.aside`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #161616;

  svg {
    min-width: 16px;
    min-height: 16px;
  }

  span {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const StyledH1 = styled.h1`
  display: flex;
  padding: 48px 40px;
  font-size: 1.5rem;
  font-weight: bold;
  flex-direction: column;
  color: #fff;

  img {
    margin: 0 0 24px 0;
    border-radius: 48px;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  }

  span {
    font-size: 1rem;
    line-height: 2rem;
    font-weight: normal;
  }

  @media (max-width: 410px) {
    padding: 48px 0;
  }
`

const StyledSwitcher = styled(Switcher)`
  padding: 48px 24px;
`

const StyledSwitcherDivider = styled(SwitcherDivider)`
  width: calc(100% - 2rem);
`

const SideBar = () => {
  const path = useLocation().pathname

  const [message, setMessage] = useState('I Show You')
  const [status, setStatus] = useState('normal')

  const handleClearAllData = () => {
    const ans = window.confirm('Really?')
    if (ans) {
      store.clearAll()
      window.location.href = '/'
    }
  }

  useEffect(() => {
    switch (path) {
      case '/': {
        setMessage('I Show You')
        setStatus('normal')
        break
      }
      case '/404': {
        setMessage('File Not Found')
        setStatus('warning')
        break
      }
      case '/500': {
        setMessage('Server Error')
        setStatus('error')
        break
      }
    }
  }, [path])

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {message === 'I Show You' ? 'Home' : message} | I Show You
        </title>
      </Helmet>
      <Container>
        <StyledH1>
          <img
            src={`/assets/${status}.svg`}
            alt="Logo"
            width={48}
            height={48}
          />
          {message}
          <br />
          <span>Preview</span>
        </StyledH1>
        <StyledSwitcher aria-label="Switcher Container">
          <SwitcherItem<LinkProps>
            element={Link}
            aria-label="Home"
            className="menu-item"
            to="/"
          >
            <StarFilled16 />
            <span>Home</span>
          </SwitcherItem>
          <SwitcherItem<LinkProps>
            element={Link}
            aria-label="Admin"
            className="menu-item"
            to="/admin"
          >
            <UserAvatarFilled16 />
            <span>Admin</span>
          </SwitcherItem>

          <StyledSwitcherDivider />
          <SwitcherItem
            aria-label="Documentation"
            href="https://lifeni.github.io/i-show-you"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            <BookmarkFilled16 />
            <span>Documentation</span>
          </SwitcherItem>
          <SwitcherItem
            aria-label="GitHub"
            href="https://github.com/Lifeni/i-show-you"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            <LogoGithub16 />
            <span>GitHub</span>
          </SwitcherItem>
          <SwitcherItem
            aria-label="GitHub Issues"
            href="https://github.com/Lifeni/i-show-you/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            <FlagFilled16 />
            <span>Report Issues</span>
          </SwitcherItem>
          <StyledSwitcherDivider />
          <SwitcherItem aria-label="Version" className="menu-item">
            <InformationFilled16 />
            <span>v{packageFile.version}</span>
          </SwitcherItem>
          <SwitcherItem
            aria-label="Clear Data"
            className="menu-item"
            onClick={handleClearAllData}
          >
            <CloseFilled16 color="#fa4d56" />
            <span className="danger">Clear All Data</span>
          </SwitcherItem>
        </StyledSwitcher>
      </Container>
    </HelmetProvider>
  )
}

export default SideBar
