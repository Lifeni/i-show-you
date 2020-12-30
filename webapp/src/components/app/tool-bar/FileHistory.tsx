import { RecentlyViewed16, RecentlyViewed20 } from '@carbon/icons-react'
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
import { addBlank } from '../../../utils/add-blank'
import { defaultNoticeOptions } from '../../../utils/global-variable'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'
import HistoryView from '../text-editor/HistoryView'

const StyledRecentlyViewed16 = styled(RecentlyViewed16)`
  margin: -4px 1rem -4px 4px;
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
      } else if (res.status === 400) {
        setNotice({
          open: true,
          kind: 'info',
          title: 'No History',
          subtitle: 'History is closed.',
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
        modalLabel={
          <>
            <StyledRecentlyViewed16 />
            {`${store.namespace(pageId).get('name')}`}
          </>
        }
        passiveModal
        size="lg"
        onRequestClose={() => setOpen(false)}
        modalAriaLabel="File History"
        aria-label="File History"
        className="gray-header"
      >
        {files.length === 0 ? (
          <p>No History</p>
        ) : (
          <Tabs type="container">
            {files.map((file: IFileAllData) => (
              <Tab
                id={file.updated_at}
                key={file.updated_at}
                title={addBlank(file.updated_at)}
                label={addBlank(file.updated_at)}
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
