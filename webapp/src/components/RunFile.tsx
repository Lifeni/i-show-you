import { Play20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'

const RunFile = (props: { mobile: boolean }) => {
  const { mobile } = props

  return (
    <>
      {!mobile && (
        <Button
          hasIconOnly
          renderIcon={Play20}
          tooltipAlignment="center"
          tooltipPosition="bottom"
          iconDescription="Run File"
          kind="ghost"
          size="field"
        />
      )}
    </>
  )
}

export default RunFile
