import { Add20 } from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  HeaderMenuItem,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react'
import React, { forwardRef, useContext, useState } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import store from 'store2'
import { useDebounce } from 'use-debounce'
import { GlobalContext } from '../App'

const HeaderFileTab = forwardRef((_, ref) => {
  const { pageId } = useContext(GlobalContext)
  const tabs = store.namespace('tabs')

  const [tabData, setTabData] = useState(tabs.getAll())
  const [debouncedTabData] = useDebounce(tabData, 300)

  const updateTabData = () => {
    setTabData(tabs.getAll())
  }
  window.addEventListener('storage', updateTabData, false)

  return (
    <>
      {Object.keys(debouncedTabData).map(key => (
        <HeaderMenuItem<LinkProps>
          element={Link}
          isCurrentPage={key === pageId}
          key={key}
          to={`/${key === 'local-file' ? '' : key}`}
        >
          {(key === 'local-file' ? '# ' : '') + debouncedTabData[key]}
        </HeaderMenuItem>
      ))}
      {Object.keys(debouncedTabData).includes('local-file') || (
        <Link to="/">
          <HeaderGlobalAction
            aria-label="New Tab"
            className="fix-icon-position"
          >
            <Add20 />
          </HeaderGlobalAction>
        </Link>
      )}
    </>
  )
})

const SideNavFileTab = () => {
  const { pageId } = useContext(GlobalContext)
  const tabs = store.namespace('tabs')

  const [tabData, setTabData] = useState(tabs.getAll())
  const [debouncedTabData] = useDebounce(tabData, 300)

  const updateTabData = () => {
    setTabData(tabs.getAll())
  }
  window.addEventListener('storage', updateTabData, false)

  return (
    <>
      <SideNavItems>
        {Object.keys(debouncedTabData).map(key => (
          <SideNavLink<LinkProps>
            element={Link}
            aria-current={key === pageId ? 'page' : 'false'}
            key={key}
            to={`/${key === 'local-file' ? '' : key}`}
            large
          >
            {(key === 'local-file' ? '# ' : '') + debouncedTabData[key]}
          </SideNavLink>
        ))}
        {Object.keys(debouncedTabData).includes('local-file') ? (
          ''
        ) : (
          <SideNavLink<LinkProps>
            element={Link}
            to="/"
            renderIcon={Add20}
            large
          >
            New Tab
          </SideNavLink>
        )}
      </SideNavItems>
    </>
  )
}

export { HeaderFileTab, SideNavFileTab }
