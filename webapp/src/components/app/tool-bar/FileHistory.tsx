import { RecentlyViewed20 } from '@carbon/icons-react'
import {
  Button,
  Modal,
  NotificationKind,
  Tab,
  Tabs,
} from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { defaultNoticeOptions } from '../../../utils/global-variable'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'
import HistoryView from '../text-editor/HistoryView'

const StyledRecentlyViewed20 = styled(RecentlyViewed20)`
  margin: -3px 1rem -3px 4px;
`

const FileHistory = () => {
  const { pageId } = useContext(GlobalContext)
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState([])

  const [notice, setNotice] = useState(defaultNoticeOptions)

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
        setNotice({
          open: true,
          kind: 'info',
          title: 'No History',
          subtitle: 'Try to change this file.',
        })
      } else {
        setNotice({
          open: true,
          kind: 'error',
          title: `Get History Error ${res.status}`,
          subtitle: (await res.json()).message,
        })
      }
    })
  }

  return (
    <>
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
        modalHeading={
          <>
            <StyledRecentlyViewed20 />
            {`History | ${store.namespace(pageId).get('name')}`}
          </>
        }
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
