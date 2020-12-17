import { Translate20 } from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  Modal,
  RadioTile,
  TileGroup,
} from 'carbon-components-react'
import React, { useState } from 'react'
import styled from 'styled-components'

const StyledTileGroup = styled(TileGroup)`
  div {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`

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
        size="xs"
        onRequestClose={() => setOpen(false)}
      >
        <StyledTileGroup defaultSelected="en" name="language-tile-group">
          <RadioTile value="en" light>
            English (Default)
          </RadioTile>
          <RadioTile value="zh-cn" light>
            中文 (Chinese)
          </RadioTile>
        </StyledTileGroup>
      </Modal>
    </>
  )
}

export default SwitchLanguage
