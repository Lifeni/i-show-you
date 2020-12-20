import { Play20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'

const canRunList = ['HTML', 'JavaScript', 'Markdown']

const RunFile = (props: { type: IFileMap }) => {
  const { type } = props

  return (
    <>
      {canRunList.includes(type.name) && (
        <Button
          hasIconOnly
          renderIcon={Play20}
          tooltipAlignment="center"
          tooltipPosition="bottom"
          iconDescription="Preview File"
          kind="ghost"
          size="field"
        />
      )}
    </>
  )
}

export default RunFile
