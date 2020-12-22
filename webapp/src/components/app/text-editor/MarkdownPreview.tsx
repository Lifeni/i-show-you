import React, { useContext, useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import store from 'store2'
import styled from 'styled-components'
import { GlobalContext } from '../../App'

const Container = styled.div`
  width: 50%;
  height: 100%;
  background-color: #fff;

  article {
    width: 100%;
    height: 100%;
    padding: 24px;
    overflow-y: auto;
  }
`

const MarkdownPreview = () => {
  const { pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)

  const [content, setContent] = useState('<div>Loading ...</div>')

  useEffect(() => {
    const updateValue = () => {
      fetch('https://api.github.com/markdown', {
        method: 'POST',
        body: JSON.stringify({
          text: currentPage.get('content'),
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(async res => {
        if (res.status === 200) {
          const data = await res.text()
          setContent(data)
        }
      })
    }
    updateValue()
    window.addEventListener('updateContent', updateValue, false)
    return () => {
      window.removeEventListener('updateContent', updateValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  return (
    <HelmetProvider>
      <Helmet>
        <link
          rel="stylesheet"
          href={
            'https://cdn.jsdelivr.net/npm/github-markdown-css@4.0.0/github-markdown.min.css'
          }
          crossOrigin="anonymous"
        />
      </Helmet>
      <Container>
        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </HelmetProvider>
  )
}

export default MarkdownPreview
