import { Button } from 'carbon-components-react'
import React from 'react'

const FileMeta = (props: { mobile: boolean; type: IFileMap }) => {
  const { mobile, type } = props
  return (
    <>
      {!mobile && (
        <Button kind="ghost" size="field">
          {type.id === -1 ? 'Local File' : type.name}
        </Button>
      )}
    </>
  )
}

export default FileMeta
