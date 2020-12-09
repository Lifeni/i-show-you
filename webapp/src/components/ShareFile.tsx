import { Link20 } from '@carbon/icons-react'
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
        setUuid(data.id)
        setRedirect(true)
      }
    })
  }
  return (
    <>
      {redirect && <Redirect to={`/${uuid}`} />}
      {isMobile ? (
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
      )}
    </>
  )
}

export default ShareFile
