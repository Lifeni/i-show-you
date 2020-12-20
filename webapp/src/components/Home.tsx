import { Column, Grid, Row } from 'carbon-components-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import styled from 'styled-components'
import FileList from './home/FileList'
import HeaderBar from './app/layout/HeaderBar'
import SideBar from './home/SideBar'

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

const Home = () => {
  return (
    <Container>
      <StyledGrid condensed>
        <StyledRow>
          <Column sm={4} md={0} lg={0} xlg={0} max={0}>
            <HeaderBar noNav={true} />
          </Column>
          <Column sm={0} md={2} lg={3} xlg={2} max={2}>
            <SideBar />
          </Column>
          <Column sm={4} md={6} lg={9} xlg={10} max={10}>
            <FileList />
          </Column>
        </StyledRow>
      </StyledGrid>
    </Container>
  )
}

export default Home
