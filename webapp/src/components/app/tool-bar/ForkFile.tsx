import { Choices20 } from '@carbon/icons-react'
import { Button, NotificationKind } from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import store from 'store2'
import { defaultNoticeOptions } from '../../../utils/global-variable'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'

const ForkFile = () => {
  const { pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)

  const [redirect, setRedirect] = useState(false)
  const [uuid, setUuid] = useState('')

  const [notice, setNotice] = useState(defaultNoticeOptions)

  const handleForkFile = async () => {
    await fetch('/api/file', {
      method: 'POST',
      body: JSON.stringify({
        created_at: currentPage.get('created_at'),
        updated_at: currentPage.get('updated_at'),
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

        tabs.set(data.data.id, {
          name: currentPage.get('name'),
          created_at: currentPage.get('created_at'),
          updated_at: currentPage.get('updated_at'),
          id: data.data.id,
          authentication: 'owner',
        })

        const targetPage = store.namespace(data.data.id)
        targetPage.set('token', data.data.token)
        targetPage.set('name', currentPage.get('name'))
        targetPage.set('created_at', currentPage.get('created_at'))
        targetPage.set('updated_at', currentPage.get('updated_at'))
        targetPage.set('type', currentPage.get('type'))
        targetPage.set('content', currentPage.get('content'))
        targetPage.set('authentication', 'owner')
        targetPage.set('options', currentPage.get('options'))

        setUuid(data.data.id)
        setRedirect(true)

        setNotice({
          open: true,
          kind: 'success',
          title: 'Forked',
          subtitle: 'You can modify this file now.',
        })
      } else {
        const data = await res.json()
        setNotice({
          open: true,
          kind: 'error',
          title: 'Fork Failed',
          subtitle: data.message,
        })
      }
    })
  }
  return (
    <>
      {redirect && <Redirect to={`/${uuid}`} />}
      <GlobalNotification
        options={{
          open: notice.open,
          close: () => setNotice({ ...notice, open: false }),
          title: notice.title,
          subtitle: notice.subtitle,
          kind: notice.kind as NotificationKind,
        }}
      />
      <Button
        hasIconOnly
        renderIcon={Choices20}
        tooltipAlignment="center"
        tooltipPosition="bottom"
        iconDescription="Fork File"
        kind="ghost"
        size="field"
        onClick={handleForkFile}
      />
    </>
  )
}

export default ForkFile
