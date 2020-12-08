import { Loading } from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Overlay = () => {
  const [id, setId] = useState(null)
  useEffect(() => {
    fetch('/api/file/new')
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setId(data.id)
        }
      })
  }, [])

  return (
    <>
      <Container>
        {id ? (
          <Redirect to={`/${id}`} />
        ) : (
          <>
            <Loading description="Editor Loading ..." withOverlay={false} />
            <h1>Creating file ...</h1>
          </>
        )}
      </Container>
    </>
  )
}

export default Overlay
