import { TrashCan20, Warning16 } from '@carbon/icons-react'
import {
  Button,
  Modal,
  NotificationKind,
  SelectableTile,
} from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Description = styled.div`
  margin: 1rem 0 0 0;
  display: flex;

  svg {
    min-width: 16px;
    min-height: 16px;
    margin: 2px 8px 0 0;
  }
`

const RemoveFile = (props: { reRender: Function }) => {
  const { reRender } = props

  const { pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)

  const [open, setOpen] = useState(false)
  const [removeLocal, setRemoveLocal] = useState(false)
  const [removeRemote, setRemoveRemote] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const [openNotification, setOpenNotification] = useState(false)
  const [notificationKind, setNotificationKind] = useState('info')
  const [notificationTitle, setNotificationTitle] = useState(
    'Unknown Notification'
  )
  const [notificationSubtitle, setNotificationSubtitle] = useState(
    'Unknown Notification'
  )

  const handleDelete = async () => {
    if (removeRemote) {
      await fetch(`/api/file/${pageId}`, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: 'Bearer ' + currentPage.get('token') || 'no-token',
        }),
      }).then(async res => {
        if (res.status === 200) {
          currentPage.set('token', '', true)
          setOpen(false)
          setRemoveRemote(false)
          if (!removeLocal) {
            reRender()
            setNotificationKind('success')
            setNotificationTitle(`File Removed`)
            setNotificationSubtitle('You can re-share it any time.')
            setOpenNotification(true)
          } else {
            currentPage.clear()
            store.namespace('tabs').remove(pageId)
            setRedirect(true)
          }
        } else {
          setNotificationKind('error')
          setNotificationTitle(`Remove Error ${res.status}`)
          setNotificationSubtitle((await res.json()).message)
          setOpenNotification(true)
        }
      })
    } else if (removeLocal) {
      currentPage.clear()
      store.namespace('tabs').remove(pageId)
      setRedirect(true)
    }
  }

  return (
    <>
      {redirect && <Redirect to={`/`} />}
      <GlobalNotification
        open={openNotification}
        close={() => setOpenNotification(false)}
        title={notificationTitle}
        subtitle={notificationSubtitle}
        kind={notificationKind as NotificationKind}
      />

      <Button
        hasIconOnly
        renderIcon={TrashCan20}
        tooltipAlignment="center"
        tooltipPosition="bottom"
        iconDescription="Remove File"
        kind="ghost"
        size="field"
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        modalHeading={`Remove ${currentPage.get('name')}`}
        modalLabel="Danger"
        primaryButtonText="Remove"
        primaryButtonDisabled={!removeLocal && !removeRemote}
        secondaryButtonText="Cancel"
        danger
        alert
        size="sm"
        onRequestSubmit={() => handleDelete()}
        onRequestClose={() => setOpen(false)}
      >
        <Group role="group" aria-label="selectable tiles">
          <SelectableTile
            id="delete-local"
            onChange={() => {
              setRemoveLocal(!removeLocal)
            }}
            value="local"
            selected={removeLocal}
            light
          >
            Local File
          </SelectableTile>
          {currentPage.get('token') === '' ||
          currentPage.get('authentication') === 'ghost' ? null : (
            <SelectableTile
              id="delete-remote"
              onChange={() => {
                setRemoveRemote(!removeRemote)
              }}
              value="remote"
              selected={removeRemote}
              light
            >
              Remote File
            </SelectableTile>
          )}
        </Group>
        <Description>
          <Warning16 />
          <span>
            {removeRemote && removeLocal ? (
              <>
                Files on the local and server will be deleted, and the shared
                file links will also become invalid.
                <br />
                <strong>You will lose this file permanently.</strong>
              </>
            ) : !removeRemote && removeLocal ? (
              'Only the local files will be deleted, and the files cannot be modified by anyone.'
            ) : !removeLocal && removeRemote ? (
              'The file on the server will be deleted, the shared file link will be invalid, you can re-share it at any time.'
            ) : (
              'No files will be deleted.'
            )}
          </span>
        </Description>
      </Modal>
    </>
  )
}

export default RemoveFile
