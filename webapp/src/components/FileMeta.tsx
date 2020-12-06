import { TooltipDefinition } from 'carbon-components-react'
import React from 'react'
import styled from 'styled-components'

const TooltipWrapper = styled.div`
  padding: 0 18px;
  font-size: 1rem;
`

const FileMeta = (props: { type: IFileMap }) => {
  const { type } = props
  return (
    <>
      <TooltipWrapper>
        <TooltipDefinition
          align="start"
          direction="bottom"
          tooltipText={
            'This is a local file and the data is stored in the browser.'
          }
        >
          {type.id === -1 ? 'Local File' : type.name}
        </TooltipDefinition>
      </TooltipWrapper>
    </>
  )
}

export default FileMeta
