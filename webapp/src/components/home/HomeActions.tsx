import React from 'react'
import styled from 'styled-components'
import NewFile from './NewFile'

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
      <NewFile />
      {/*<ImportFile />*/}
    </ButtonWrapper>
  )
}

export default HomeActions
