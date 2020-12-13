import { Information20, Link20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import store from 'store2'
import { GlobalContext } from '../App'

const ShareFile = () => {
  const { isMobile, pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)
  const [redirect, setRedirect] = useState(false)
  const [uuid, setUuid] = useState('')

  const share = async () => {
    await fetch('/api/file', {
      method: 'POST',
      body: JSON.stringify({
        created_at: currentPage.get('created-at'),
        updated_at: currentPage.get('updated-at'),
        name: currentPage.get('name'),
        type: currentPage.get('type'),
        content: currentPage.get('content'),
        line: currentPage.get('line'),
      }),
    }).then(async res => {
      if (res.ok) {
        const data = await res.json()
        const tabs = store.namespace('tabs')
        tabs.set(
          data.id,
          JSON.stringify({
            name: currentPage.get('name'),
            created_at: currentPage.get('created-at'),
          })
        )
        tabs.remove('local-file')
        const targetPage = store.namespace(data.id)
        targetPage.set('token', data.token)
        targetPage.set('name', currentPage.get('name'))
        targetPage.set('created-at', currentPage.get('created-at'))
        targetPage.set('updated-at', currentPage.get('updated-at'))
        targetPage.set('type', currentPage.get('type'))
        targetPage.set('content', currentPage.get('content'))
        targetPage.set('line', currentPage.get('line'))
        currentPage.clearAll()
        setUuid(data.id)
        setRedirect(true)
      }
    })
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
          kind="primary"
          size="field"
        />
      ) : (
        <Button kind="primary" size="field" renderIcon={Information20}>
          Link Info
        </Button>
      )}
    </>
  )
}

export default ShareFile
