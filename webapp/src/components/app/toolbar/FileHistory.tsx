import { RecentlyViewed20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'

const FileHistory = () => {
  return (
    <>
      <Button
        hasIconOnly
        renderIcon={RecentlyViewed20}
        tooltipAlignment="center"
        tooltipPosition="bottom"
        iconDescription="History"
        kind="ghost"
        size="field"
      />
    </>
  )
}

export default FileHistory
