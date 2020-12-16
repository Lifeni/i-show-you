import { Add20, Cloud20, Edit20, Screen20 } from '@carbon/icons-react'
import {
  Button,
  ClickableTile,
  Column,
  Grid,
  Row,
} from 'carbon-components-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Link, Redirect, useLocation } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'

dayjs.extend(relativeTime)

const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  padding: 48px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledGrid = styled(Grid)`
  width: 100%;
`

const TopBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0 24px;
`

const StyledH1 = styled.h1`
  display: flex;
  padding: 24px 0;
  font-size: 1.5rem;
  align-items: center;

  img {
    margin: 0 24px 0 0;
    border-radius: 48px;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 410px) {
    padding: 48px 0;
  }
`

const ButtonWrapper = styled.div`
  padding: 24px 0;

  a {
    text-decoration: none;
  }
`

const EmptyBox = styled.div`
  width: 100%;
  min-height: 50vh;
  padding: 48px;
  border: dashed 2px #e0e0e0;
  color: #616161;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FileBox = styled.div`
  max-height: calc(100vh - 192px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
`

const StyledTile = styled(ClickableTile)`
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }

  h2 {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    width: 100%;
    margin: 0 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  time {
    white-space: nowrap;
  }
`

const StyledScreenIcon = styled(Screen20)`
  margin: 0 16px 0 0;
`

const StyledCloudIcon = styled(Cloud20)`
  margin: 0 16px 0 0;
`

const Home = () => {
  const [message, setMessage] = useState('I Show You')
  const [status, setStatus] = useState('normal')
  const [redirect, setRedirect] = useState('')
  const [isEmpty, setEmpty] = useState(true)
  const path = useLocation().pathname
  const tabs = store.namespace('tabs')

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

  let isMobile = false

  window.addEventListener('DOMContentLoaded', () => {
    isMobile = window.innerWidth < 720
  })

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(() => {
      isMobile = window.innerWidth < 720
    })
  })

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
  }, [tabs])

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <title>Home | I Show You</title>
        </Helmet>
        <StyledGrid>
          <Row>
            <Column sm={0} md={1} lg={2} xlg={3} />
            <Column sm={4} md={6} lg={8} xlg={6}>
              <TopBar>
                <StyledH1>
                  <img
                    src={`/assets/${status}.svg`}
                    alt="Logo"
                    width={48}
                    height={48}
                  />
                  {message}
                </StyledH1>
                <ButtonWrapper>
                  <Link to="/">
                    {tabData.some(data => data.id === 'local-file') ? (
                      <Button renderIcon={Edit20}>Edit Local File</Button>
                    ) : (
                      <Button renderIcon={Add20}>New File</Button>
                    )}
                  </Link>
                </ButtonWrapper>
              </TopBar>
            </Column>
            <Column sm={0} md={1} lg={2} xlg={3} />
          </Row>
          <Row>
            <Column sm={0} md={1} lg={2} xlg={3} />
            <Column sm={4} md={6} lg={8} xlg={6}>
              {redirect === '' ? null : <Redirect to={redirect} />}
              {isEmpty ? (
                <EmptyBox>👀 No File</EmptyBox>
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
                          <StyledScreenIcon />
                        ) : (
                          <StyledCloudIcon />
                        )}

                        <h2>{data.name}</h2>
                      </div>

                      {isMobile ? null : (
                        <p>
                          {store
                            .namespace(data.id)
                            .get('content')
                            .slice(0, 120)}
                        </p>
                      )}

                      <time>{dayjs(data.updated_at).fromNow()}</time>
                    </StyledTile>
                  ))}
                </FileBox>
              )}
            </Column>
            <Column sm={0} md={1} lg={2} xlg={3} />
          </Row>
        </StyledGrid>
      </Container>
    </HelmetProvider>
  )
}

export default Home
