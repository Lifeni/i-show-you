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
import { GlobalContext } from '../../App'

const IconWrapper = styled.span`
  svg {
    margin: -3px 8px -3px 0;
  }
`

const HeaderFileTab = forwardRef((_, ref) => {
  const { pageId } = useContext(GlobalContext)
  const tabs = store.namespace('tabs')

  const [tabData, setTabData] = useState(
    Object.values(tabs.getAll()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )
  const [debouncedTabData] = useDebounce(tabData, 300)

  useEffect(() => {
    const updateTabData = () => {
      setTabData(
        Object.values(tabs.getAll()).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      )
    }

    window.addEventListener('storage', updateTabData, false)
    return () => {
      window.removeEventListener('storage', updateTabData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const currentPage = store.namespace(pageId)
    if (currentPage.get('authentication') !== 'owner') {
      const updateTabData = () => {
        setTabData(
          Object.values(tabs.getAll()).sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        )
      }
      window.addEventListener('updateStorage', updateTabData, false)
      return () => {
        window.removeEventListener('updateStorage', updateTabData)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  return (
    <>
      {debouncedTabData.map(data => (
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
      ))}

      <Link to="/new" key="add-file">
        <HeaderGlobalAction aria-label="New File" className="fix-icon-position">
          <Add20 />
        </HeaderGlobalAction>
      </Link>
    </>
  )
})

const SideNavFileTab = () => {
  const { pageId } = useContext(GlobalContext)
  const tabs = store.namespace('tabs')

  const [tabData, setTabData] = useState(
    Object.values(tabs.getAll()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )
  const [debouncedTabData] = useDebounce(tabData, 300)

  useEffect(() => {
    const updateTabData = () => {
      setTabData(
        Object.values(tabs.getAll()).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      )
    }

    window.addEventListener('storage', updateTabData, false)
    return () => {
      window.removeEventListener('storage', updateTabData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const currentPage = store.namespace(pageId)
    if (currentPage.get('authentication') !== 'owner') {
      const updateTabData = () => {
        setTabData(
          Object.values(tabs.getAll()).sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        )
      }
      window.addEventListener('updateStorage', updateTabData, false)
      return () => {
        window.removeEventListener('updateStorage', updateTabData)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  return (
    <>
      <SideNavItems>
        <SideNavLink<LinkProps>
          element={Link}
          to="/new"
          renderIcon={Add20}
          large
          key="add-file"
        >
          New File
        </SideNavLink>

        {debouncedTabData.map(data => (
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
        ))}
      </SideNavItems>
    </>
  )
}

export { HeaderFileTab, SideNavFileTab }
