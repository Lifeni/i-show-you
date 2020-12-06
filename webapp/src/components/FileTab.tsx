import { Add20 } from '@carbon/icons-react'
import {
  Button,
  HeaderMenuItem,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react'
import React, { forwardRef } from 'react'
import '../styles/FileTab.css'

const HeaderFileTab = forwardRef((_, ref) => {
  return (
    <>
      <HeaderMenuItem ref={ref} isCurrentPage>
        Untitled File
      </HeaderMenuItem>
      <Button
        hasIconOnly
        renderIcon={Add20}
        tooltipAlignment="center"
        tooltipPosition="bottom"
        iconDescription="New Tab"
        kind="ghost"
        size="field"
        className="new-tab"
      />
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
