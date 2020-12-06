import { Link20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React from 'react'

const ShareFile = (props: { mobile: boolean }) => {
  const { mobile } = props
  return (
    <>
      {mobile ? (
        <Button
          hasIconOnly
          renderIcon={Link20}
          tooltipAlignment="center"
          tooltipPosition="bottom"
          iconDescription="Get Share Link"
          kind="primary"
          size="field"
        />
      ) : (
        <Button kind="primary" size="field" renderIcon={Link20}>
          Get Share Link
        </Button>
      )}
    </>
  )
}

export default ShareFile
