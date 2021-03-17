import { Loading } from 'carbon-components-react'
import React from 'react'
import styled from 'styled-components'

const LoadingWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;

  svg {
    transform: scale(0.5);
  }
`
const GlobalLoading = () => {
  return (
    <LoadingWrapper>
      <Loading description="Loading ..." withOverlay={false} />
    </LoadingWrapper>
  )
}

export default GlobalLoading
