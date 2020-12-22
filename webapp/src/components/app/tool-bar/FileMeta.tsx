import { InlineLoading } from 'carbon-components-react'
import React, { useContext } from 'react'
import store from 'store2'
import styled from 'styled-components'
import { GlobalContext } from '../../App'

const TooltipWrapper = styled.div`
  padding: 0 18px;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.34;
  letter-spacing: 0.32px;
  color: #525252;
`

const FileMeta = (props: { status: string; type: IFileMap }) => {
  const { status } = props
  const { pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)
  return (
    <>
      <TooltipWrapper>
        {currentPage.get('authentication') === 'owner' ? (
          status === 'Auto Save OFF' ? (
            status
          ) : (
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
          )
        ) : (
          'Read Only'
        )}
      </TooltipWrapper>
    </>
  )
}

export default FileMeta
