import { Add20 } from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  HeaderMenuItem,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react'
import React, { forwardRef } from 'react'
import { useParams } from 'react-router-dom'
import store from 'store2'

const HeaderFileTab = forwardRef((_, ref) => {
  const { id }: IURLParams = useParams()
  const currentPage = store.namespace(id || 'local-file')

  return (
    <>
      <HeaderMenuItem ref={ref} isCurrentPage>
        {currentPage.get('token') === '' ? 'Local File' : id.slice(-8)}
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
  const { id }: IURLParams = useParams()
  const currentPage = store.namespace(id || 'local-file')
  return (
    <>
      <SideNavItems>
        <SideNavLink large aria-current="page">
          {currentPage.get('token') === '' ? 'Local File' : id.slice(-8)}
        </SideNavLink>
        <SideNavLink renderIcon={Add20} large>
          New Tab
        </SideNavLink>
      </SideNavItems>
    </>
  )
}

export { HeaderFileTab, SideNavFileTab }
