import { Information20, Link20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import store from 'store2'
import { GlobalContext } from '../App'
const ShareFile = () => {
  const { isMobile } = useContext(GlobalContext)
  const { id }: IURLParams = useParams()
  const currentPage = store.namespace(id || 'local-file')
  const [redirect, setRedirect] = useState(false)
  const [uuid, setUuid] = useState('')

  const share = async () => {
    await fetch('/api/file', {
      method: 'POST',
      body: JSON.stringify({
        name: currentPage.get('name'),
        type: currentPage.get('type'),
        content: currentPage.get('content'),
      }),
    }).then(async res => {
      if (res.ok) {
        const data = await res.json()
        const targetPage = store.namespace(data.id)
        targetPage.set('token', data.token)
        targetPage.set('name', currentPage.get('name'))
        targetPage.set('type', currentPage.get('type'))
        targetPage.set('content', currentPage.get('content'))
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
            kind="tertiary"
            size="field"
            renderIcon={Link20}
            style={{ border: 'none', paddingRight: '56px' }}
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
        <Button
          kind="tertiary"
          size="field"
          renderIcon={Information20}
          style={{ border: 'none', paddingRight: '56px' }}
        >
          Link Info
        </Button>
      )}
    </>
  )
}

export default ShareFile
