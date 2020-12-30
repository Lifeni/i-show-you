import { Cloud16, Cloud20, Screen16, Screen20 } from '@carbon/icons-react'
import {
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

  const getTabData = () => {
    return Object.values(tabs.getAll()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  const [tabData, setTabData] = useState(getTabData)
  const [debouncedTabData] = useDebounce(tabData, 300)

  useEffect(() => {
    const updateTabData = () => {
      setTabData(getTabData)
    }

    updateTabData()
    window.addEventListener('updateFileEvent', updateTabData, false)
    return () => {
      window.removeEventListener('updateFileEvent', updateTabData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    </>
  )
})

const SideNavFileTab = () => {
  const { pageId } = useContext(GlobalContext)
  const tabs = store.namespace('tabs')

  const getTabData = () => {
    return Object.values(tabs.getAll()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  const [tabData, setTabData] = useState(getTabData)
  const [debouncedTabData] = useDebounce(tabData, 300)

  useEffect(() => {
    const updateTabData = () => {
      setTabData(getTabData)
    }

    updateTabData()
    window.addEventListener('updateFileEvent', updateTabData, false)
    return () => {
      window.removeEventListener('updateFileEvent', updateTabData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SideNavItems>
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
