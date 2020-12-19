import { DocumentAdd20, DocumentImport20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

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

const HomeActions = () => {
  return (
    <ButtonWrapper>
      <Link to="/new">
        <Button renderIcon={DocumentAdd20}>New File</Button>
      </Link>
      <Button renderIcon={DocumentImport20} kind="secondary">
        Import File
      </Button>
    </ButtonWrapper>
  )
}

export default HomeActions
