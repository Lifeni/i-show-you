import {
  Add20,
  Cloud16,
  Cloud20,
  Screen16,
  Screen20,
} from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  HeaderMenuItem,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react'
import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { GlobalContext } from '../App'

const IconWrapper = styled.span`
  svg {
    margin: -3px 8px -3px 0;
  }
`

const HeaderFileTab = forwardRef((_, ref) => {
  const { pageId } = useContext(GlobalContext)
  const tabs = store.namespace('tabs')

  const [tabData, setTabData] = useState(
    Object.values(tabs.getAll())
      .map(v => JSON.parse(v))
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
  )
  const [debouncedTabData] = useDebounce(tabData, 300)

  useEffect(() => {
    const updateTabData = () => {
      setTabData(
        Object.values(tabs.getAll())
          .map(v => JSON.parse(v))
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
      )
    }

    window.addEventListener('storage', updateTabData, false)
    return () => {
      window.removeEventListener('storage', updateTabData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {debouncedTabData.map(data =>
        data.id === 'local-file' ? (
          <HeaderMenuItem<LinkProps>
            element={Link}
            isCurrentPage={data.id === pageId}
            key={data.id}
            to={`/`}
          >
            <IconWrapper>
              <Screen16 />
            </IconWrapper>
            {data.name === '' ? 'Untitled File' : data.name}
          </HeaderMenuItem>
        ) : null
      )}
      {debouncedTabData.map(data =>
        data.id === 'local-file' ? null : (
          <HeaderMenuItem<LinkProps>
            element={Link}
            isCurrentPage={data.id === pageId}
            key={data.id}
            to={`/${data.id}`}
          >
            {data.authentication === 'owner' ? (
              <IconWrapper>
                <Screen16 />
              </IconWrapper>
            ) : (
              <IconWrapper>
                <Cloud16 />
              </IconWrapper>
            )}
            {data.name === '' ? 'Untitled File' : data.name}
          </HeaderMenuItem>
        )
      )}
      {debouncedTabData.some(key => key.id === 'local-file') ? null : (
        <Link to="/" key="add-file">
          <HeaderGlobalAction
            aria-label="New File"
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

  const [tabData, setTabData] = useState(
    Object.values(tabs.getAll())
      .map(v => JSON.parse(v))
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
  )
  const [debouncedTabData] = useDebounce(tabData, 300)

  useEffect(() => {
    const updateTabData = () => {
      setTabData(
        Object.values(tabs.getAll())
          .map(v => JSON.parse(v))
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
      )
    }

    window.addEventListener('storage', updateTabData, false)
    return () => {
      window.removeEventListener('storage', updateTabData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SideNavItems>
        {debouncedTabData.some(data => data.id === 'local-file') ? null : (
          <SideNavLink<LinkProps>
            element={Link}
            to="/"
            renderIcon={Add20}
            large
            key="add-file"
          >
            New File
          </SideNavLink>
        )}

        {debouncedTabData.map(data =>
          data.id === 'local-file' ? (
            <SideNavLink<LinkProps>
              element={Link}
              aria-current={data.id === pageId ? 'page' : 'false'}
              key={data.id}
              to={`/`}
              large
              renderIcon={Screen20}
            >
              {data.name === '' ? 'Untitled File' : data.name}
            </SideNavLink>
          ) : null
        )}

        {debouncedTabData.map(data =>
          data.id === 'local-file' ? null : (
            <SideNavLink<LinkProps>
              element={Link}
              aria-current={data.id === pageId ? 'page' : 'false'}
              key={data.id}
              to={`/${data.id}`}
              large
              renderIcon={data.authentication === 'owner' ? Screen20 : Cloud20}
            >
              {data.name === '' ? 'Untitled File' : data.name}
            </SideNavLink>
          )
        )}
      </SideNavItems>
    </>
  )
}

export { HeaderFileTab, SideNavFileTab }
