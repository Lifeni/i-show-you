import { Translate20 } from '@carbon/icons-react'
import { HeaderGlobalAction } from 'carbon-components-react'
import React from 'react'

const SwitchLanguage = () => {
  return (
    <>
      <HeaderGlobalAction
        aria-label="Select Language"
        onClick={() => {}}
        className="fix-icon-position"
      >
        <Translate20 />
      </HeaderGlobalAction>
    </>
  )
}

export default SwitchLanguage
