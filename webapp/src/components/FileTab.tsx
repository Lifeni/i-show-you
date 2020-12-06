import { Document16 } from '@carbon/icons-react'
import {
  HeaderMenuItem,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react'
import React from 'react'

const HeaderFileTab = () => {
  return (
    <>
      <HeaderMenuItem isCurrentPage href="#">
        New Memo
      </HeaderMenuItem>
    </>
  )
}

const SideNavFileTab = () => {
  return (
    <>
      <SideNavItems>
        <SideNavLink renderIcon={Document16} href="/" large aria-current="page">
          Untitled Memo
        </SideNavLink>
      </SideNavItems>
    </>
  )
}

export { HeaderFileTab, SideNavFileTab }
