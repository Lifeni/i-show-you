import { DocumentAdd20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'
import { Link } from 'react-router-dom'

const NewFile = () => {
  return (
    <Link to="/new">
      <Button renderIcon={DocumentAdd20}>New File</Button>
    </Link>
  )
}

export default NewFile
