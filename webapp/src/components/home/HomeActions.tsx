import { DocumentAdd20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const ButtonWrapper = styled.div`
  max-width: 976px;
  margin: 12px auto 36px auto;
  display: flex;

  @media (max-width: 410px) {
    margin: 0 0 16px 0;
  }

  a {
    text-decoration: none;
  }

  button {
    margin: 0 8px;
  }
`

const HomeActions = () => {
  return (
    <ButtonWrapper>
      <Link to="/new">
        <Button renderIcon={DocumentAdd20}>New File</Button>
      </Link>
    </ButtonWrapper>
  )
}

export default HomeActions
