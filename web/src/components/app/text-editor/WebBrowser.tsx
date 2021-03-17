import React, { useContext, useEffect, useState } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { GlobalContext } from '../../App'

const Container = styled.div`
  width: 50%;
  height: 100%;
  background-color: #fff;

  iframe {
    width: 100%;
    height: 100%;
  }
`

const WebBrowser = () => {
  const { pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)

  const [content, setContent] = useState(currentPage.get('content'))

  useEffect(() => {
    const updateValue = () => {
      setContent(currentPage.get('content'))
    }
    updateValue()
    window.addEventListener('updateViewEvent', updateValue, false)
    return () => {
      window.removeEventListener('updateViewEvent', updateValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  return (
    <Container>
      <iframe title="web-browser" srcDoc={content} />
    </Container>
  )
}

export default WebBrowser
