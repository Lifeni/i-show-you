import React from 'react'

import { Button } from 'carbon-components-react'
import { SettingsAdjust20 } from '@carbon/icons-react'

const FileOption = () => {
  return (
    <>
      <Button
        hasIconOnly
        renderIcon={SettingsAdjust20}
        tooltipAlignment="center"
        tooltipPosition="bottom"
        iconDescription="Options"
        kind="ghost"
        size="field"
      />
    </>
  )
}

export default FileOption
