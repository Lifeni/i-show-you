import { Add20 } from '@carbon/icons-react'
import { Button, Column, Grid, Row } from 'carbon-components-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

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

const Home = () => {
  let message = 'I Show You'
  const query = new URLSearchParams(useLocation().search)
  if (query.get('404') === '') {
    message = 'File Not Found'
  }
  return (
    <Container>
      <StyledGrid>
        <Row>
          <Column sm={0} lg={1} xlg={2} />
          <Column sm={4} md={8} lg={10} xlg={8}>
            <TopBar>
              <StyledH1>{message}</StyledH1>
              <ButtonWrapper>
                <Link to="/">
                  <Button renderIcon={Add20}>New File</Button>
                </Link>
              </ButtonWrapper>
            </TopBar>
          </Column>
          <Column sm={0} lg={1} xlg={2} />
        </Row>
        <Row>
          <Column sm={0} lg={1} xlg={2} />
          <Column sm={4} md={8} lg={10} xlg={8}>
            <EmptyBox>No Local File</EmptyBox>
          </Column>
          <Column sm={0} lg={1} xlg={2} />
        </Row>
      </StyledGrid>
    </Container>
  )
}

export default Home
