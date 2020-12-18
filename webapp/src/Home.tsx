import {
  BookmarkFilled16,
  CloseFilled16,
  Cloud16,
  DocumentAdd20,
  DocumentImport20,
  Edit20,
  FlagFilled16,
  InformationFilled16,
  LogoGithub16,
  Screen16,
  StarFilled16,
  Time16,
  UserAvatarFilled16,
} from '@carbon/icons-react'
import {
  Button,
  ClickableTile,
  Column,
  Grid,
  Row,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
} from 'carbon-components-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Link, LinkProps, Redirect, useLocation } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import packageFile from '../package.json'
import HeaderBar from './components/HeaderBar'
import { MobileTipsInline } from './components/MobileTips'

dayjs.extend(relativeTime)

const Container = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
`

const StyledGrid = styled(Grid)`
  width: 100%;
  max-width: unset;
  margin: 0;
  padding: 0;
`

const StyledRow = styled(Row)`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;

  [class*='bx--col'] {
    padding: 0;
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

const ButtonWrapper = styled.div`
  max-width: 960px;
  margin: 12px auto 36px auto;
  display: flex;
  gap: 16px;

  @media (max-width: 410px) {
    margin: 0 0 16px 0;
  }

  a {
    text-decoration: none;
  }
`

const EmptyBox = styled.div`
  max-width: 960px;
  margin: 0 auto 12px auto;
  height: calc(100vh - 180px);
  min-height: 50vh;
  padding: 48px;
  border: dashed 2px #e0e0e0;
  color: #616161;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FileBox = styled.div`
  max-width: 960px;
  margin: 0 auto 12px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`

const StyledTile = styled(ClickableTile)`
  width: 100%;
  min-width: 240px;
  max-width: 300px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  border-radius: 4px;

  @media (max-width: 410px) {
    max-width: unset;
  }

  div {
    width: 100%;
    padding: 20px 24px 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    svg {
      min-width: 16px;
      min-height: 16px;
      margin: 0;
    }

    time,
    span {
      display: flex;
      align-items: center;
      svg {
        margin: 0 8px 0 0;
      }
    }
  }

  h2 {
    width: 100%;
    padding: 0 24px;
    font-size: 1rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  pre {
    position: relative;
    width: calc(100% - 24px);
    height: calc((276px / 16) * 9);
    margin: 8px 12px 12px 12px;
    padding: 10px 12px;
    font-size: 0.75rem;
    line-height: 1rem;
    overflow: hidden;
    white-space: pre-wrap;
    background-color: #f4f4f4;
    transition: all 0.15s cubic-bezier(0.2, 0, 0.38, 0.9);

    ::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 100;
      width: 100%;
      display: flex;
      box-shadow: 0 0 24px 24px #f4f4f4;
      transition: all 0.15s cubic-bezier(0.2, 0, 0.38, 0.9);
    }
  }

  time {
    white-space: nowrap;
  }

  :hover pre {
    color: #616161;
    background-color: #e5e5e5;

    ::after {
      box-shadow: 0 0 24px 24px #e5e5e5;
    }
  }
`

const SideBar = styled.aside`
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

const FileList = styled.div`
  width: 100%;
  height: 100vh;
  padding: 36px;
  overflow: auto;

  @media (max-width: 672px) {
    height: calc(100vh - 48px);
  }

  @media (max-width: 410px) {
    padding: 24px;
  }
`

const StyledSwitcher = styled(Switcher)`
  padding: 48px 24px;
`

const StyledSwitcherDivider = styled(SwitcherDivider)`
  width: calc(100% - 2rem);
`

const Home = () => {
  const [message, setMessage] = useState('I Show You')
  const [status, setStatus] = useState('normal')
  const [redirect, setRedirect] = useState('200')
  const [isEmpty, setEmpty] = useState(true)
  const path = useLocation().pathname
  const tabs = store.namespace('tabs')

  const handleClearAllData = () => {
    const ans = window.confirm('Really?')
    if (ans) {
      store.clearAll()
      window.location.href = '/home'
    }
  }

  useEffect(() => {
    switch (path) {
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

  const [isMobile, setMobile] = useState(false)
  useEffect(() => {
    const checkWidth = () => {
      window.requestAnimationFrame(() => {
        setMobile(window.innerWidth < 672)
      })
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)

    return () => {
      window.removeEventListener('resize', checkWidth)
    }
  }, [])

  const [tabData, setTabData] = useState(
    Object.values(tabs.getAll())
      .map(v => JSON.parse(v))
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
  )

  useEffect(() => {
    if (tabs.size() === 0) {
      setEmpty(true)
    } else {
      setEmpty(false)
    }

    const updateTabData = () => {
      setTabData(
        Object.values(tabs.getAll())
          .map(v => JSON.parse(v))
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
      )
    }

    window.addEventListener(
      'storage',
      () => {
        updateTabData()
      },
      false
    )

    return () => {
      window.removeEventListener('storage', updateTabData)
    }
  }, [tabs])

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <title>
            {message === 'I Show You' ? 'Home' : message} | I Show You
          </title>
        </Helmet>
        {redirect === '200' ? null : <Redirect to={redirect} />}
        <StyledGrid condensed>
          <StyledRow>
            <Column sm={4} md={0} lg={0} xlg={0} max={0}>
              <HeaderBar noNav={true} />
            </Column>
            <Column sm={0} md={2} lg={3} xlg={2} max={2}>
              <SideBar>
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
                    to="/home"
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
              </SideBar>
            </Column>
            <Column sm={4} md={6} lg={9} xlg={10} max={10}>
              <FileList>
                {isMobile ? (
                  <MobileTipsInline />
                ) : (
                  <ButtonWrapper>
                    <Link to="/">
                      {tabData.some(data => data.id === 'local-file') ? (
                        <Button renderIcon={Edit20}>Edit Local File</Button>
                      ) : (
                        <Button renderIcon={DocumentAdd20}>New File</Button>
                      )}
                    </Link>
                    <Button renderIcon={DocumentImport20} kind="secondary">
                      Import File
                    </Button>
                  </ButtonWrapper>
                )}

                {isEmpty ? (
                  <EmptyBox>No File</EmptyBox>
                ) : (
                  <FileBox>
                    {tabData.map(data => (
                      <StyledTile
                        handleClick={() => {
                          setRedirect(
                            `/${data.id === 'local-file' ? '' : data.id}`
                          )
                        }}
                        key={data.created_at}
                      >
                        <div>
                          {data.id === 'local-file' ? (
                            <span>
                              <Screen16 />
                              Local
                            </span>
                          ) : (
                            <span>
                              <Cloud16 />
                              Shared
                            </span>
                          )}
                          <time>
                            <Time16 />
                            {dayjs(data.updated_at).fromNow()}
                          </time>
                        </div>

                        <h2>{data.name || 'Untitled File'}</h2>

                        <pre>
                          <code>
                            {store.namespace(data.id).get('content')
                              ? store
                                  .namespace(data.id)
                                  .get('content')
                                  .slice(0, 200)
                              : ''}
                          </code>
                        </pre>
                      </StyledTile>
                    ))}
                  </FileBox>
                )}
              </FileList>
            </Column>
          </StyledRow>
        </StyledGrid>
      </Container>
    </HelmetProvider>
  )
}

export default Home
