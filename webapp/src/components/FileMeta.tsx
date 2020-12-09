import { TooltipDefinition } from 'carbon-components-react'
import React from 'react'
import { useParams } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'

const TooltipWrapper = styled.div`
  padding: 0 18px;
  font-size: 1rem;
`

const FileMeta = (props: { type: IFileMap }) => {
  const { type } = props
  const { id }: IURLParams = useParams()
  const currentPage = store.namespace(id || 'local-file')
  return (
    <>
      <TooltipWrapper>
        {currentPage.get('token') === '' ? (
          <TooltipDefinition
            align="start"
            direction="bottom"
            tooltipText={
              'This is a local file and the data is stored in the browser.'
            }
          >
            {type.id === -1 ? 'Local File' : type.name}
          </TooltipDefinition>
        ) : (
          <TooltipDefinition
            align="start"
            direction="bottom"
            tooltipText={'The file will be saved to both local and server.'}
          >
            {type.id === -1 ? 'Auto Saved' : type.name}
          </TooltipDefinition>
        )}
      </TooltipWrapper>
    </>
  )
}

export default FileMeta
