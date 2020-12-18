import { ArrowRight20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: calc(100vh - 48px);
  padding: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  div {
    font-size: 3rem;
    padding: 48px 24px;
  }

  h2 {
    font-size: 1.5rem;
    text-align: center;
    margin: 0 0 48px 0;
  }
`

const InlineContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 0 0 24px 0;
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  div {
    font-size: 2rem;
    padding: 24px;
  }

  h2 {
    font-size: 1.125rem;
    text-align: center;
    margin: 0 0 24px 0;
  }
`

const MobileTips = () => {
  const [hidden, setHidden] = useState(false)

  return hidden ? null : (
    <Container>
      <div aria-hidden={true}>😦</div>
      <h2>Your device may not support editing</h2>
      <Button renderIcon={ArrowRight20} kind="primary">
        Learn More
      </Button>
      <Button kind="ghost" onClick={() => setHidden(true)}>
        Continue Editing ...
      </Button>
    </Container>
  )
}

const MobileTipsInline = () => {
  return (
    <InlineContainer>
      <div aria-hidden={true}>😦</div>
      <h2>Your device may not support editing</h2>
      <Button size="field" renderIcon={ArrowRight20} kind="primary">
        Learn More
      </Button>
    </InlineContainer>
  )
}

export { MobileTips, MobileTipsInline }
