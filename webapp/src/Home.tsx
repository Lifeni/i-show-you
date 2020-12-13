import { Add20, Cloud20, Screen20, View20 } from '@carbon/icons-react'
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
  padding: 24px 0;
  font-size: 1.75rem;
`

const ButtonWrapper = styled.div`
  padding: 24px 0;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
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
    font-size: 1.25rem;
    font-weight: light;
    white-space: nowrap;
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
  const [redirect, setRedirect] = useState('')
  const [isEmpty, setEmpty] = useState(true)
  const path = useLocation().pathname
  const tabs = store.namespace('tabs')

  const [tabData, setTabData] = useState(tabs.getAll())

  useEffect(() => {
    if (path !== '/home') {
      setMessage('File Not Found')
    }
  }, [path])

  useEffect(() => {
    if (tabs.size() === 0) {
      setEmpty(true)
    } else {
      setEmpty(false)
    }

    const updateTabData = () => {
      setTabData(tabs.getAll())
    }

    window.addEventListener('storage', updateTabData, false)
  }, [tabs])

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <title>Home | I Show You</title>
        </Helmet>
        <StyledGrid>
          <Row>
            <Column sm={0} lg={1} xlg={2} />
            <Column sm={4} md={8} lg={10} xlg={8}>
              <TopBar>
                <StyledH1>{message}</StyledH1>
                <ButtonWrapper>
                  <Link to="/">
                    {Object.keys(tabData).some(key => key === 'local-file') ? (
                      <Button renderIcon={View20}>View Local File</Button>
                    ) : (
                      <Button renderIcon={Add20}>New File</Button>
                    )}
                  </Link>
                </ButtonWrapper>
              </TopBar>
            </Column>
            <Column sm={0} lg={1} xlg={2} />
          </Row>
          <Row>
            <Column sm={0} lg={1} xlg={2} />
            <Column sm={4} md={8} lg={10} xlg={8}>
              {redirect === '' ? null : <Redirect to={redirect} />}
              {isEmpty ? (
                <EmptyBox>👀 No File</EmptyBox>
              ) : (
                <FileBox>
                  {Object.keys(tabData).map(key => (
                    <StyledTile
                      handleClick={() => {
                        setRedirect(
                          `/${
                            JSON.parse(tabData[key]).id === 'local-file'
                              ? ''
                              : JSON.parse(tabData[key]).id
                          }`
                        )
                      }}
                      key={JSON.parse(tabData[key]).created_at}
                    >
                      <div>
                        {JSON.parse(tabData[key]).id === 'local-file' ? (
                          <StyledScreenIcon />
                        ) : (
                          <StyledCloudIcon />
                        )}

                        <h2>{JSON.parse(tabData[key]).name}</h2>
                      </div>

                      <p>
                        {store
                          .namespace(JSON.parse(tabData[key]).id)
                          .get('content')
                          .slice(0, 120)}
                      </p>

                      <time>
                        {dayjs(JSON.parse(tabData[key]).created_at).fromNow()}
                      </time>
                    </StyledTile>
                  ))}
                </FileBox>
              )}
            </Column>
            <Column sm={0} lg={1} xlg={2} />
          </Row>
        </StyledGrid>
      </Container>
    </HelmetProvider>
  )
}

export default Home
