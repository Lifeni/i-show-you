import {
  Header,
  HeaderContainer,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  SideNav,
  SkipToContent,
} from 'carbon-components-react'
import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import styled from 'styled-components'

import { HeaderFileTab, SideNavFileTab } from './FileTab'
import HeaderRightMenu from './HeaderRightMenu'
import HorizontalScroller from './HorizontalScroller'
import SwitchLanguage from './SwitchLanguage'

const StyledHeader = styled(Header)`
  position: relative;
`

const HeaderNameWrapper = styled.div`
  white-space: nowrap;
  text-decoration: none;
`

const StyledHeaderMenuButton = styled(HeaderMenuButton)`
  width: 48px;
  min-width: 48px;
  height: 48px;
`

const HeaderBar = (props: { noNav: boolean }) => {
  const { noNav } = props
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
            <HeaderName<LinkProps> element={Link} prefix="I Show" to="/">
              You
            </HeaderName>
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
