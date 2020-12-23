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
import React, { useContext, useEffect, useState } from 'react'
import store from 'store2'
import styled from 'styled-components'
import {
  defaultFileOptions,
  defaultNoticeOptions,
} from '../../../utils/global-variable'
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
    white-space: nowrap;

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
  const { isMobile, pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)

  const [notice, setNotice] = useState(defaultNoticeOptions)

  const [options, setOptions] = useState(
    currentPage.get('options') || defaultFileOptions
  )

  useEffect(() => {
    setOptions(currentPage.get('options') || defaultFileOptions)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  const handleOptionsSave = () => {
    if (currentPage.get('authentication') === 'owner') {
      fetch(`/api/file/${pageId}/options`, {
        method: 'PATCH',
        body: JSON.stringify({ options: options }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + currentPage.get('token') || 'no-token',
        }),
      }).then(async res => {
        if (res.status === 200) {
          setNotice({
            open: true,
            kind: 'success',
            title: 'Options Saved',
            subtitle: 'I remember it all.',
          })
        } else {
          setNotice({
            open: true,
            kind: 'error',
            title: `Save Error ${res.status}`,
            subtitle: (await res.json()).message,
          })
        }
      })
    }

    currentPage.set('options', options)

    setOpen(false)
    window.dispatchEvent(new Event('updateFileEvent'))
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
                toggled={options.auto_save}
                id="auto-save"
                onToggle={e => setOptions({ ...options, auto_save: e })}
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
              toggled={options.word_wrap}
              onToggle={e => setOptions({ ...options, word_wrap: e })}
            />
          </FormItem>
          <FormItemBlock>
            <span>
              <Language16 />
              Font Family
            </span>
            <TextArea
              id="font-family"
              value={options.font_family}
              labelText=""
              aria-label="Font Family"
              onChange={e => setOptions({ ...options, font_family: e })}
            />
          </FormItemBlock>
          <FormItem>
            <span>
              <TextSmallCaps16 />
              Font Size
            </span>
            <NumberInput
              id="font-size"
              value={options.font_size}
              size="sm"
              aria-label="Font Size"
              isMobile={isMobile}
              onChange={e => {
                setOptions({
                  ...options,
                  // @ts-ignore
                  font_size: Number(e.imaginaryTarget.value),
                })
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
              value={options.line_height}
              size="sm"
              aria-label="Line Height"
              isMobile={isMobile}
              onChange={e => {
                setOptions({
                  ...options,
                  // @ts-ignore
                  line_height: Number(e.imaginaryTarget.value),
                })
              }}
            />
          </FormItem>
        </Form>
      </Modal>
    </>
  )
}

export default FileOption
