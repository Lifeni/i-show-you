import {
  CloudUpload16,
  Language16,
  SettingsAdjust20,
  TextLeading16,
  TextSmallCaps16,
  TextWrap16,
} from '@carbon/icons-react'

import {
  Button,
  Form,
  Modal,
  NotificationKind,
  NumberInput,
  TextArea,
  Toggle,
} from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { GlobalContext } from '../../App'
import GlobalNotification from '../../global/GlobalNotification'

const FormItem = styled.section`
  width: 100%;
  margin: 0.75rem 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    display: flex;
    align-items: center;

    svg {
      margin: 0 0.75rem 0 0;
    }
  }
`

const FormItemBlock = styled(FormItem)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  span {
    margin: 0.4rem 0 1rem 0;
  }
`

const FileOption = () => {
  const [open, setOpen] = useState(false)
  const { pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)

  const [openNotification, setOpenNotification] = useState(false)
  const [notificationKind, setNotificationKind] = useState('info')
  const [notificationTitle, setNotificationTitle] = useState(
    'Unknown Notification'
  )
  const [notificationSubtitle, setNotificationSubtitle] = useState(
    'Unknown Notification'
  )

  const [autoSave, setAutoSave] = useState(currentPage.get('options').auto_save)
  const [wordWrap, setWordWrap] = useState(currentPage.get('options').word_wrap)
  const [fontFamily, setFontFamily] = useState(
    currentPage.get('options').font_family ||
      "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace"
  )
  const [fontSize, setFontSize] = useState(
    currentPage.get('options').font_size || 14
  )
  const [lineHeight, setLineHeight] = useState(
    currentPage.get('options').line_height || 22
  )

  const handleOptionsSave = () => {
    const options: IFileOptions = {
      auto_save: autoSave,
      word_wrap: wordWrap,
      font_family: fontFamily,
      font_size: Number(fontSize),
      line_height: Number(lineHeight),
    }
    if (currentPage.get('authentication') === 'owner') {
      fetch(`/api/file/${pageId}/options`, {
        method: 'PATCH',
        body: JSON.stringify({ options: options, updated_at: new Date() }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + currentPage.get('token') || 'no-token',
        }),
      }).then(async res => {
        if (res.status === 200) {
          setNotificationKind('success')
          setNotificationTitle(`Options Saved`)
          setNotificationSubtitle('I remember it all.')
          setOpenNotification(true)
        } else {
          setNotificationKind('error')
          setNotificationTitle(`Save Error ${res.status}`)
          setNotificationSubtitle((await res.json()).message)
          setOpenNotification(true)
        }
      })

      const tabs = store.namespace('tabs')
      const pre = tabs.get(pageId)
      tabs.set(
        pageId,
        JSON.stringify({
          ...JSON.parse(pre),
          updated_at: new Date(),
        })
      )
      currentPage.set('updated-at', new Date())
    }

    currentPage.set('options', options)

    setOpen(false)
    window.dispatchEvent(new Event('updateStorage'))
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
        renderIcon={SettingsAdjust20}
        tooltipAlignment="start"
        tooltipPosition="bottom"
        iconDescription="Options"
        kind="ghost"
        size="field"
        onClick={() => setOpen(true)}
      />

      <Modal
        open={open}
        modalHeading="File Options"
        modalLabel="Modify"
        primaryButtonText={
          currentPage.get('authentication') === 'owner'
            ? 'Apply and Sync'
            : 'Apply'
        }
        secondaryButtonText="Cancel"
        size="xs"
        onRequestSubmit={() => handleOptionsSave()}
        onRequestClose={() => setOpen(false)}
        hasForm={true}
      >
        <Form>
          {currentPage.get('authentication') === 'owner' ? (
            <FormItem>
              <span>
                <CloudUpload16 />
                Auto Save
              </span>
              <Toggle
                aria-label="Auto Save"
                defaultToggled={autoSave}
                id="auto-save"
                onToggle={e => setAutoSave(e)}
              />
            </FormItem>
          ) : null}

          <FormItem>
            <span>
              <TextWrap16 />
              Word Wrap
            </span>
            <Toggle
              aria-label="Word Wrap"
              id="word-wrap"
              defaultToggled={wordWrap}
              onToggle={e => setWordWrap(e)}
            />
          </FormItem>
          <FormItemBlock>
            <span>
              <Language16 />
              Font Family
            </span>
            <TextArea
              id="font-family"
              defaultValue={fontFamily}
              labelText=""
              aria-label="Font Family"
              onChange={e => setFontFamily(e.target.value)}
            />
          </FormItemBlock>
          <FormItem>
            <span>
              <TextSmallCaps16 />
              Font Size
            </span>
            <NumberInput
              id="font-size"
              value={fontSize}
              size="sm"
              aria-label="Font Size"
              onChange={e => {
                // @ts-ignore
                setFontSize(e.imaginaryTarget.value)
              }}
            />
          </FormItem>
          <FormItem>
            <span>
              <TextLeading16 />
              Line Height
            </span>
            <NumberInput
              id="line-height"
              value={lineHeight}
              size="sm"
              aria-label="Line Height"
              onChange={e => {
                // @ts-ignore
                setLineHeight(e.imaginaryTarget.value)
              }}
            />
          </FormItem>
        </Form>
      </Modal>
    </>
  )
}

export default FileOption
