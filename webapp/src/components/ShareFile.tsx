import { Information20, Link16, Link20 } from '@carbon/icons-react'
import {
  Button,
  CodeSnippet,
  ContentSwitcher,
  Link,
  Modal,
  Switch,
} from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { GlobalContext } from '../App'

const CodeSnippetWrapper = styled.div`
  padding: 16px 0 12px 0;
`

const StyledLink16 = styled(Link16)`
  margin: -3px 8px -3px 0;
`

const ShareFile = () => {
  const { isMobile, pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)
  const [redirect, setRedirect] = useState(false)
  const [uuid, setUuid] = useState('')
  const [open, setOpen] = useState(false)
  const [pageSwitch, setPageSwitch] = useState('link')

  const share = async () => {
    await fetch('/api/file', {
      method: 'POST',
      body: JSON.stringify({
        created_at: currentPage.get('created-at'),
        updated_at: currentPage.get('updated-at'),
        name: currentPage.get('name'),
        type: currentPage.get('type'),
        content: currentPage.get('content'),
        options: currentPage.get('options'),
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(async res => {
      if (res.ok) {
        const data = await res.json()
        const tabs = store.namespace('tabs')
        tabs.set(
          data.data.id,
          JSON.stringify({
            name: currentPage.get('name'),
            created_at: currentPage.get('created-at'),
            updated_at: currentPage.get('updated-at'),
            id: data.data.id,
            authentication: currentPage.get('authentication'),
          })
        )
        tabs.remove('local-file')
        const targetPage = store.namespace(data.data.id)
        targetPage.set('token', data.data.token)
        targetPage.set('name', currentPage.get('name'))
        targetPage.set('created-at', currentPage.get('created-at'))
        targetPage.set('updated-at', currentPage.get('updated-at'))
        targetPage.set('type', currentPage.get('type'))
        targetPage.set('content', currentPage.get('content'))
        targetPage.set('authentication', currentPage.get('authentication'))
        targetPage.set('options', currentPage.get('options'))

        currentPage.clearAll()
        setUuid(data.data.id)
        setRedirect(true)
        setOpen(true)
      }
    })
  }

  const show = () => {
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
  }

  const handleSwitch = (tab: string) => {
    setPageSwitch(tab)
  }

  const handleCopy = async (str?: string) => {
    if (str) {
      await navigator.clipboard.writeText(str)
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      {redirect && <Redirect to={`/${uuid}`} />}
      {currentPage.get('token') === '' ? (
        isMobile ? (
          <Button
            hasIconOnly
            renderIcon={Link20}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            iconDescription="Get Share Link"
            kind="primary"
            size="field"
            onClick={share}
          />
        ) : (
          <Button
            kind="primary"
            size="field"
            renderIcon={Link20}
            onClick={share}
          >
            Get Share Link
          </Button>
        )
      ) : isMobile ? (
        <Button
          hasIconOnly
          renderIcon={Information20}
          tooltipAlignment="center"
          tooltipPosition="bottom"
          iconDescription="Link Info"
          kind="ghost"
          size="field"
          onClick={show}
        />
      ) : (
        <Button
          kind="ghost"
          size="field"
          renderIcon={Information20}
          onClick={show}
        >
          Link Info
        </Button>
      )}
      <Modal
        open={open}
        modalHeading="Your Share Link"
        modalLabel="Share"
        primaryButtonText="Copy Link and Close"
        secondaryButtonText="Close"
        size="sm"
        onRequestClose={close}
        onRequestSubmit={() => {
          handleCopy().then(() => {
            close()
          })
        }}
      >
        <ContentSwitcher light>
          <Switch
            name="link"
            text="Link"
            onClick={() => handleSwitch('link')}
            onKeyDown={() => {}}
          />
          <Switch
            name="markdown"
            text="Markdown"
            onClick={() => handleSwitch('markdown')}
            onKeyDown={() => {}}
          />
          <Switch
            name="raw"
            text="Raw"
            onClick={() => handleSwitch('raw')}
            onKeyDown={() => {}}
          />
          <Switch
            name="embed"
            text="Embed"
            onClick={() => handleSwitch('embed')}
            onKeyDown={() => {}}
          />
        </ContentSwitcher>
        {pageSwitch === 'link' ? (
          <>
            <CodeSnippetWrapper>
              <CodeSnippet
                type="multi"
                light
                wrapText
                onClick={() => handleCopy(window.location.href)}
              >
                {window.location.href}
              </CodeSnippet>
            </CodeSnippetWrapper>
            <Link href={window.location.href} target="_blank">
              <StyledLink16 />
              {window.location.href}
            </Link>
          </>
        ) : pageSwitch === 'markdown' ? (
          <>
            <CodeSnippetWrapper>
              <CodeSnippet
                type="multi"
                light
                wrapText
                onClick={() =>
                  handleCopy(`[${document.title}](${window.location.href})`)
                }
              >
                {`[${document.title}](${window.location.href})`}
              </CodeSnippet>
            </CodeSnippetWrapper>
            <Link href={window.location.href} target="_blank">
              <StyledLink16 />
              {document.title}
            </Link>
          </>
        ) : pageSwitch === 'raw' ? (
          <>
            <CodeSnippetWrapper>
              <CodeSnippet
                type="multi"
                light
                wrapText
                onClick={() =>
                  handleCopy(
                    window.location.origin + '/api/file/' + pageId + '/raw'
                  )
                }
              >
                {window.location.origin + '/api/file/' + pageId + '/raw'}
              </CodeSnippet>
            </CodeSnippetWrapper>
            <Link
              href={window.location.origin + '/api/file/' + pageId + '/raw'}
              target="_blank"
            >
              <StyledLink16 />
              {window.location.origin + '/api/file/' + pageId + '/raw'}
            </Link>
          </>
        ) : pageSwitch === 'embed' ? (
          <CodeSnippetWrapper>
            <CodeSnippet type="multi" light wrapText hideCopyButton>
              Coming Soon ...
            </CodeSnippet>
          </CodeSnippetWrapper>
        ) : null}
      </Modal>
    </>
  )
}

export default ShareFile
