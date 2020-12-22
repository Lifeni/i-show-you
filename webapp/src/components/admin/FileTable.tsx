import { Link20, Logout20, Renew20, TrashCan20 } from '@carbon/icons-react'
import {
  Button,
  DataTable,
  NotificationKind,
  Pagination,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { isMobile } from '../../utils/is-mobile'
import GlobalNotification from '../global/GlobalNotification'

const headerData = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'type', header: 'Type' },
  { key: 'created_at', header: 'Created At' },
  { key: 'updated_at', header: 'Updated At' },
]

const StyledTableContainer = styled(TableContainer)`
  position: relative;
  width: 100%;
  height: auto;
  padding: 24px 24px 0 24px;

  @media (max-width: 410px) {
    padding: 24px 16px 0 16px;
  }

  table {
    white-space: nowrap;
    overflow: hidden;
  }

  td {
    font-family: 'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono',
      'Bitstream Vera Sans Mono', Courier, monospace;

    span {
      font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    }
  }
`

const ButtonWrapper = styled.div`
  height: 100%;
`

const FileTable = (props: { data: Array<IFileData> }) => {
  let { data } = props
  const [fileData, setFileData] = useState(data)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const adminPage = store.namespace('admin-page')
  const [openNotification, setOpenNotification] = useState(false)
  const [notificationKind, setNotificationKind] = useState('info')
  const [notificationTitle, setNotificationTitle] = useState(
    'Unknown Notification'
  )
  const [notificationSubtitle, setNotificationSubtitle] = useState(
    'Unknown Notification'
  )

  useEffect(() => {
    setFileData(data)
  }, [data])

  const getRowData = () => {
    return fileData
      .sort((a, b) => {
        if (
          new Date(a.updated_at).getTime() < new Date(b.updated_at).getTime()
        ) {
          return 1
        }
        return -1
      })
      .slice((page - 1) * pageSize, page * pageSize)
  }

  const [rowData, setRowData] = useState(getRowData())
  useEffect(() => {
    setRowData(getRowData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, fileData])

  const handleLogout = () => {
    adminPage.remove('token')
    setRedirect(true)
  }

  const handlePageChange = (e: { page: number; pageSize: number }) => {
    setPage(e.page)
    setPageSize(e.pageSize)
  }

  const handleRemoveFile = (id: string) => {
    const ans = window.confirm(`Remove ${id}?`)
    if (ans) {
      fetch(`/api/admin/file/${id}`, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: 'Bearer ' + adminPage.get('token') || 'no-token',
        }),
      }).then(async res => {
        if (res.status === 200) {
          setNotificationKind('success')
          setNotificationTitle(`File Removed`)
          setNotificationSubtitle('I have the final say.')
          setOpenNotification(true)
          setFileData(fileData.filter(f => f.id !== id))
        } else {
          setNotificationKind('error')
          setNotificationTitle(`Remove Error ${res.status}`)
          setNotificationSubtitle((await res.json()).message)
          setOpenNotification(true)
        }
      })
    }
  }

  const handleRemoveMultipleFiles = (rows: Array<any>) => {
    const files = rows.map(row => row.id)
    const ans = window.confirm(`Remove ${files.join('\n')}?`)
    if (ans) {
      fetch(`/api/admin/files`, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: 'Bearer ' + adminPage.get('token') || 'no-token',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          files: files,
        }),
      }).then(async res => {
        if (res.status === 200) {
          setNotificationKind('success')
          setNotificationTitle(`File Removed`)
          setNotificationSubtitle('I have the final say.')
          setOpenNotification(true)
          setFileData(fileData.filter(f => !files.includes(f.id)))
        } else {
          setNotificationKind('error')
          setNotificationTitle(`Remove Error ${res.status}`)
          setNotificationSubtitle((await res.json()).message)
          setOpenNotification(true)
        }
      })
    }
  }

  const handleGetData = () => {
    setLoading(true)
    fetch('/api/admin', {
      headers: new Headers({
        Authorization: 'Bearer ' + adminPage.get('token') || 'no-token',
      }),
    }).then(async res => {
      const data = await res.json()
      if (res.status === 200) {
        setFileData(data.data)
      } else {
        setNotificationKind('error')
        setNotificationTitle(`Fetch Error ${res.status}`)
        setNotificationSubtitle(data.message)
        setOpenNotification(true)
      }
      setLoading(false)
    })
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
      <DataTable
        rows={rowData}
        headers={headerData}
        useStaticWidth={true}
        isSortable={true}
      >
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getBatchActionProps,
          onInputChange,
          selectedRows,
        }: ITableParams) => (
          <StyledTableContainer stickyHeader={true}>
            <TableToolbar>
              <TableBatchActions {...getBatchActionProps()}>
                <TableBatchAction
                  tabIndex={
                    getBatchActionProps().shouldShowBatchActions ? 0 : -1
                  }
                  renderIcon={TrashCan20}
                  onClick={() => handleRemoveMultipleFiles(selectedRows)}
                >
                  Delete
                </TableBatchAction>
              </TableBatchActions>
              <TableToolbarContent>
                <TableToolbarSearch
                  tabIndex={
                    getBatchActionProps().shouldShowBatchActions ? -1 : 0
                  }
                  onChange={onInputChange}
                />
                <ButtonWrapper>
                  {isMobile() ? (
                    <Button
                      hasIconOnly
                      renderIcon={Renew20}
                      tooltipAlignment="end"
                      tooltipPosition="top"
                      iconDescription="Update Data"
                      tabIndex={
                        getBatchActionProps().shouldShowBatchActions ? -1 : 0
                      }
                      kind="ghost"
                      onClick={handleGetData}
                    />
                  ) : (
                    <Button
                      tabIndex={
                        getBatchActionProps().shouldShowBatchActions ? -1 : 0
                      }
                      onClick={handleGetData}
                      renderIcon={Renew20}
                      kind="primary"
                      disabled={loading}
                    >
                      {loading ? 'Loading' : 'Update Data'}
                    </Button>
                  )}
                  {isMobile() ? (
                    <Button
                      hasIconOnly
                      renderIcon={Logout20}
                      tooltipAlignment="end"
                      tooltipPosition="top"
                      iconDescription="Logout"
                      tabIndex={
                        getBatchActionProps().shouldShowBatchActions ? -1 : 0
                      }
                      kind="ghost"
                      onClick={handleLogout}
                    />
                  ) : (
                    <Button
                      hasIconOnly
                      renderIcon={Logout20}
                      tooltipAlignment="end"
                      tooltipPosition="top"
                      iconDescription="Logout"
                      tabIndex={
                        getBatchActionProps().shouldShowBatchActions ? -1 : 0
                      }
                      kind="secondary"
                      onClick={handleLogout}
                    />
                  )}
                </ButtonWrapper>
              </TableToolbarContent>
            </TableToolbar>
            <Table isSortable={true}>
              <TableHead>
                <TableRow>
                  <TableSelectAll {...getSelectionProps()} />
                  {headers.map((header: any) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: { id: string; cells: any[] }) => (
                  <TableRow {...getRowProps({ row })}>
                    <TableSelectRow {...getSelectionProps({ row })} />
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>
                        {cell.info.header === 'updated_at' ||
                        cell.info.header === 'created_at'
                          ? new Date(cell.value)
                              .toLocaleString()
                              .replace(/上午/, ' 上午 ')
                              .replace(/下午/, ' 下午 ')
                          : cell.value}
                      </TableCell>
                    ))}
                    <TableCell key="file-actions">
                      <Button
                        hasIconOnly
                        renderIcon={Link20}
                        tooltipAlignment="center"
                        tooltipPosition="top"
                        iconDescription="Open File Link"
                        kind="ghost"
                        size="field"
                        href={`/${row.id}`}
                        target="_blank"
                      />
                      <Button
                        hasIconOnly
                        renderIcon={TrashCan20}
                        tooltipAlignment="end"
                        tooltipPosition="top"
                        iconDescription="Remove File"
                        kind="ghost"
                        size="field"
                        onClick={() => handleRemoveFile(row.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              onChange={handlePageChange}
              pageSize={10}
              pageSizes={[10, 20, 50, 100, 300]}
              totalItems={fileData.length}
            />
          </StyledTableContainer>
        )}
      </DataTable>
    </>
  )
}

export default FileTable
