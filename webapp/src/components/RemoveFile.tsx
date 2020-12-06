import { TrashCan20 } from '@carbon/icons-react'
import { Button, Modal } from 'carbon-components-react'
import React, { useState } from 'react'

const RemoveFile = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
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
        modalHeading="Remove Untitled File"
        modalLabel="Danger"
        primaryButtonText="Remove"
        secondaryButtonText="Cancel"
        danger
        alert
        size="xs"
        onRequestClose={() => setOpen(false)}
      >
        <p>
          The <strong>local</strong> and <strong>cloud</strong> files will be
          deleted, and others will no longer be able to see this file.{' '}
          <strong>This operation cannot be undone.</strong>
        </p>
      </Modal>
    </>
  )
}

export default RemoveFile
