import React from 'react'
import styled from 'styled-components'
import TextEditor from './components/TextEditor'
import HeaderBar from './components/HeaderBar'
import { Column, Grid, Row } from 'carbon-components-react'

const Wrapper = styled.main`
  padding-top: 72px;
`

const App = () => {
  return (
    <Wrapper>
      <Grid>
        <Row>
          <Column>
            <HeaderBar />
          </Column>
        </Row>
        <Row>
          <Column></Column>
          <Column md={12} lg={10} xlg={8}>
            <TextEditor />
          </Column>
          <Column></Column>
        </Row>
        <Grid />
      </Grid>
    </Wrapper>
  )
}

export default App
