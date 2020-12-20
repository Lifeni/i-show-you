import {
  InlineLoading,
  TooltipDefinition,
  TooltipIcon,
} from 'carbon-components-react'
import React, { useContext } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { GlobalContext } from '../../App'

const TooltipWrapper = styled.div`
  padding: 0 18px;
  font-size: 1rem;
`

const FileMeta = (props: { status: string; type: IFileMap }) => {
  const { status, type } = props
  const { pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)
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
        ) : currentPage.get('authentication') === 'owner' ? (
          <TooltipIcon
            align="start"
            direction="bottom"
            tooltipText={'The file will be saved to both local and server.'}
          >
            <InlineLoading
              description={status}
              status={
                status === 'Saving'
                  ? 'active'
                  : status === 'Error'
                  ? 'error'
                  : 'finished'
              }
            />
          </TooltipIcon>
        ) : (
          <TooltipDefinition
            align="start"
            direction="bottom"
            tooltipText={'You cannot edit this file.'}
          >
            Read Only
          </TooltipDefinition>
        )}
      </TooltipWrapper>
    </>
  )
}

export default FileMeta
