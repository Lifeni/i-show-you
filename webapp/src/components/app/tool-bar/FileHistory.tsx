import { RecentlyViewed20 } from '@carbon/icons-react'
import {
  Button,
  Modal,
  NotificationKind,
  Tab,
  Tabs,
} from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'
import HistoryView from '../text-editor/HistoryView'

const FileHistory = () => {
  const { pageId } = useContext(GlobalContext)
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState([])

  const [openNotification, setOpenNotification] = useState(false)
  const [notificationKind, setNotificationKind] = useState('info')
  const [notificationTitle, setNotificationTitle] = useState(
    'Unknown Notification'
  )
  const [notificationSubtitle, setNotificationSubtitle] = useState(
    'Unknown Notification'
  )

  const handleOpenHistory = () => {
    fetch(`/api/file/${pageId}/history`).then(async res => {
      if (res.status === 200) {
        const data = await res.json()
        const temp = data.data.sort(
          (a: { updated_at: string }, b: { updated_at: string }) => {
            if (
              new Date(a.updated_at).getTime() <
              new Date(b.updated_at).getTime()
            ) {
              return 1
            }
            return -1
          }
        )
        setFiles(temp)
        setOpen(true)
      } else if (res.status === 404) {
        setNotificationKind('info')
        setNotificationTitle(`No History`)
        setNotificationSubtitle('Files older than 3 minutes will be saved.')
        setOpenNotification(true)
      } else {
        setNotificationKind('error')
        setNotificationTitle(`Get History Error ${res.status}`)
        setNotificationSubtitle((await res.json()).message)
        setOpenNotification(true)
      }
    })
  }

  return (
    <>
      <GlobalNotification
        open={openNotification}
        close={() => setOpenNotification(false)}
        title={notificationTitle}
        subtitle={notificationSubtitle}
        kind={notificationKind as NotificationKind}
      />

      <Button
        hasIconOnly
        renderIcon={RecentlyViewed20}
        tooltipAlignment="center"
        tooltipPosition="bottom"
        iconDescription="History"
        kind="ghost"
        size="field"
        onClick={() => handleOpenHistory()}
      />

      <Modal
        open={open}
        modalHeading="File History"
        modalLabel="View"
        passiveModal
        size="lg"
        onRequestClose={() => setOpen(false)}
        modalAriaLabel="File History"
      >
        {files.length === 0 ? (
          <p>No History</p>
        ) : (
          <Tabs>
            {files.map((file: IFileAllData) => (
              <Tab
                id={file.updated_at}
                key={file.updated_at}
                title={new Date(file.updated_at)
                  .toLocaleString()
                  .replace(/上午/, ' 上午 ')
                  .replace(/下午/, ' 下午 ')}
                label={new Date(file.updated_at)
                  .toLocaleString()
                  .replace(/上午/, ' 上午 ')
                  .replace(/下午/, ' 下午 ')}
              >
                <HistoryView type={file.type} data={file.content} />
              </Tab>
            ))}
          </Tabs>
        )}
      </Modal>
    </>
  )
}

export default FileHistory
