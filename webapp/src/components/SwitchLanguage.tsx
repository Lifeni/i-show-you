import { Translate20 } from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  Modal,
  RadioTile,
  TileGroup,
} from 'carbon-components-react'
import React, { useState } from 'react'

const SwitchLanguage = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <HeaderGlobalAction
        aria-label="Select Language"
        onClick={() => setOpen(true)}
        className="fix-icon-position"
      >
        <Translate20 />
      </HeaderGlobalAction>
      <Modal
        open={open}
        modalHeading="Switch Display Language"
        modalLabel="Internationalization"
        primaryButtonText="OK"
        secondaryButtonText="Cancel"
        danger
        alert
        size="xs"
        onRequestClose={() => setOpen(false)}
      >
        <p>The language setting will be stored in the browser.</p>
        <br />
        <TileGroup defaultSelected="en" name="language-tile-group">
          <RadioTile value="en">English (Default)</RadioTile>
          <RadioTile value="zh-cn">中文 (Chinese)</RadioTile>
        </TileGroup>
      </Modal>
    </>
  )
}

export default SwitchLanguage
