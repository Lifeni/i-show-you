import { Add20 } from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  HeaderMenuItem,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react'
import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import store from 'store2'
import { useDebounce } from 'use-debounce'
import { GlobalContext } from '../App'

const HeaderFileTab = forwardRef((_, ref) => {
  const { pageId } = useContext(GlobalContext)
  const tabs = store.namespace('tabs')

  const [tabData, setTabData] = useState(tabs.getAll())
  const [debouncedTabData] = useDebounce(tabData, 300)

  useEffect(() => {
    const updateTabData = () => {
      setTabData(tabs.getAll())
    }

    window.addEventListener('storage', updateTabData, false)
  }, [tabs])

  return (
    <>
      {Object.keys(debouncedTabData).map(key =>
        key === 'local-file' ? (
          <HeaderMenuItem<LinkProps>
            element={Link}
            isCurrentPage={key === pageId}
            key={JSON.parse(debouncedTabData[key]).created_at}
            to={`/`}
          >
            {'# ' +
              (JSON.parse(debouncedTabData[key]).name === ''
                ? 'Untitled File'
                : JSON.parse(debouncedTabData[key]).name)}
          </HeaderMenuItem>
        ) : null
      )}
      {Object.keys(debouncedTabData).map(key =>
        key === 'local-file' ? null : (
          <HeaderMenuItem<LinkProps>
            element={Link}
            isCurrentPage={key === pageId}
            key={JSON.parse(debouncedTabData[key]).created_at}
            to={`/${key}`}
          >
            {JSON.parse(debouncedTabData[key]).name === ''
              ? 'Untitled File'
              : JSON.parse(debouncedTabData[key]).name}
          </HeaderMenuItem>
        )
      )}
      {Object.keys(debouncedTabData).some(
        key => key === 'local-file'
      ) ? null : (
        <Link to="/" key="add-file">
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

  useEffect(() => {
    const updateTabData = () => {
      setTabData(tabs.getAll())
    }

    window.addEventListener('storage', updateTabData, false)
  }, [tabs])

  return (
    <>
      <SideNavItems>
        {Object.keys(debouncedTabData).map(key =>
          key === 'local-file' ? (
            <SideNavLink<LinkProps>
              element={Link}
              aria-current={key === pageId ? 'page' : 'false'}
              key={JSON.parse(debouncedTabData[key]).created_at}
              to={`/`}
              large
            >
              {'# ' +
                (JSON.parse(debouncedTabData[key]).name === ''
                  ? 'Untitled File'
                  : JSON.parse(debouncedTabData[key]).name)}
            </SideNavLink>
          ) : null
        )}

        {Object.keys(debouncedTabData).map(key =>
          key === 'local-file' ? null : (
            <SideNavLink<LinkProps>
              element={Link}
              aria-current={key === pageId ? 'page' : 'false'}
              key={JSON.parse(debouncedTabData[key]).created_at}
              to={`/${key}`}
              large
            >
              {JSON.parse(debouncedTabData[key]).name === ''
                ? 'Untitled File'
                : JSON.parse(debouncedTabData[key]).name}
            </SideNavLink>
          )
        )}
        {Object.keys(debouncedTabData).some(
          key => key === 'local-file'
        ) ? null : (
          <SideNavLink<LinkProps>
            element={Link}
            to="/"
            renderIcon={Add20}
            large
            key="add-file"
          >
            New Tab
          </SideNavLink>
        )}
      </SideNavItems>
    </>
  )
}

export { HeaderFileTab, SideNavFileTab }
