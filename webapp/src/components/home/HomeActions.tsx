import React from 'react'
import styled from 'styled-components'
import ImportFile from '../app/header/ImportFile'
import NewFile from '../app/header/NewFile'

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
      <NewFile />
      <ImportFile />
    </ButtonWrapper>
  )
}

export default HomeActions
