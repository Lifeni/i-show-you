import { DocumentImport20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'

const ImportFile = () => {
  return (
    <Button renderIcon={DocumentImport20} kind="secondary">
      Import File
    </Button>
  )
}

export default ImportFile
