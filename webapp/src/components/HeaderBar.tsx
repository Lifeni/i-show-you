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

import '../styles/HeaderBar.css'
import { HeaderFileTab, SideNavFileTab } from './FileTab'
import HeaderRightMenu from './HeaderRightMenu'
import SwitchLanguage from './SwitchLanguage'

const StyledHeader = styled(Header)`
  position: relative;
`

const HeaderBar = () => {
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <StyledHeader aria-label="Header of I Show You">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open Menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName prefix="I Show">You</HeaderName>
          <HeaderNavigation aria-label="Your Files">
            <HeaderFileTab />
          </HeaderNavigation>
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
