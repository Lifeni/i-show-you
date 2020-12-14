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
import styled from 'styled-components'

import { HeaderFileTab, SideNavFileTab } from './FileTab'
import HeaderRightMenu from './HeaderRightMenu'
import HorizontalScroller from './HorizontalScroller'
import SwitchLanguage from './SwitchLanguage'

const StyledHeader = styled(Header)`
  position: relative;
`

const StyledHeaderName = styled(HeaderName)`
  white-space: nowrap;
`

const StyledHeaderMenuButton = styled(HeaderMenuButton)`
  width: 48px;
  min-width: 48px;
  height: 48px;
`

const HeaderBar = () => {
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <StyledHeader aria-label="Header of I Show You">
          <SkipToContent />
          <StyledHeaderMenuButton
            aria-label="Open Menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <StyledHeaderName href="/" prefix="I Show">
            You
          </StyledHeaderName>

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
          <HeaderGlobalBar>
            <SwitchLanguage />
            <HeaderRightMenu />
          </HeaderGlobalBar>
        </StyledHeader>
      )}
    />
  )
}

export default HeaderBar
