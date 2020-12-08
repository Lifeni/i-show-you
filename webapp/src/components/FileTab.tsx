import { Add20 } from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  HeaderMenuItem,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react'
import React, { forwardRef } from 'react'

const HeaderFileTab = forwardRef((_, ref) => {
  return (
    <>
      <HeaderMenuItem ref={ref} isCurrentPage>
        Untitled File
      </HeaderMenuItem>
      <HeaderGlobalAction
        aria-label="New Tab"
        onClick={() => {}}
        className="fix-icon-position"
      >
        <Add20 />
      </HeaderGlobalAction>
    </>
  )
})

const SideNavFileTab = () => {
  return (
    <>
      <SideNavItems>
        <SideNavLink large aria-current="page">
          Untitled File
        </SideNavLink>
        <SideNavLink renderIcon={Add20} large>
          New Tab
        </SideNavLink>
      </SideNavItems>
    </>
  )
}

export { HeaderFileTab, SideNavFileTab }
