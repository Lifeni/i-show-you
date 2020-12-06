import { TrashCan20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'

const RemoveFile = () => {
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
      />
    </>
  )
}

export default RemoveFile
