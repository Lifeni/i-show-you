import { Add20 } from '@carbon/icons-react'
import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  SideNav,
  SkipToContent,
} from 'carbon-components-react'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { HeaderFileTab, SideNavFileTab } from '../header/FileTab'
import HeaderRightMenu from '../header/HeaderRightMenu'
import HorizontalScroller from '../header/HorizontalScroller'
import SwitchLanguage from '../header/SwitchLanguage'

const StyledHeader = styled(Header)`
  position: relative;
  width: 100%;
`

const HeaderNameWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
  }
`

const StyledHeaderMenuButton = styled(HeaderMenuButton)`
  width: 48px;
  min-width: 48px;
  height: 48px;
`

const HeaderBar = (props: {
  noNav: boolean
  title?: string
  prefix?: string
}) => {
  const { noNav, title, prefix } = props
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <StyledHeader aria-label="Header of I Show You">
          <SkipToContent />
          {noNav ? null : (
            <StyledHeaderMenuButton
              aria-label="Open Menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
          )}
          <HeaderNameWrapper>
            <Link to="/new">
              <HeaderGlobalAction
                aria-label="New File"
                className="fix-icon-position add-file"
              >
                <HeaderName element="span" prefix={prefix || 'I Show'}>
                  {title || 'You'}
                </HeaderName>
                <Add20 />
              </HeaderGlobalAction>
            </Link>
          </HeaderNameWrapper>

          {noNav ? null : (
            <>
              <HorizontalScroller>
                <HeaderNavigation
                  key="header-nav"
                  id="header-nav"
                  aria-label="Your Files"
                >
                  <HeaderFileTab />
                </HeaderNavigation>
              </HorizontalScroller>

              <SideNav
                aria-label="Side Navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}
              >
                <SideNavFileTab />
              </SideNav>
            </>
          )}

          <HeaderGlobalBar>
            {noNav ? null : <SwitchLanguage />}
            <HeaderRightMenu />
          </HeaderGlobalBar>
        </StyledHeader>
      )}
    />
  )
}

export default HeaderBar
