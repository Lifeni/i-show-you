import {
  AppSwitcher20,
  BookmarkFilled16,
  CloseFilled16,
  Document16,
  FlagFilled16,
  InformationFilled16,
  LogoGithub16,
  Translate20,
} from '@carbon/icons-react'

import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderPanel,
  SideNav,
  SideNavItems,
  SideNavLink,
  SkipToContent,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
} from 'carbon-components-react'
import React, { useState } from 'react'
import styled from 'styled-components'

import '../styles/HeaderBar.css'

const StyledHeaderPanel = styled(HeaderPanel)`
  height: fit-content;
  padding-bottom: 1rem;
`

const StyledHeader = styled(Header)`
  position: relative;
  border-bottom: none;
`

const HeaderBar = () => {
  const [switcher, setSwitcher] = useState(false)
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <StyledHeader aria-label="Header of I Show You">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="#" prefix="I Show You">
            Memo
          </HeaderName>
          <HeaderNavigation aria-label="Your Pages">
            <HeaderMenuItem isCurrentPage href="#">
              New Memo
            </HeaderMenuItem>
          </HeaderNavigation>
          <SideNav
            aria-label="Side navigation"
            expanded={isSideNavExpanded}
            isPersistent={false}
          >
            <SideNavItems>
              <SideNavLink
                renderIcon={Document16}
                href="#"
                large
                aria-current="page"
              >
                Untitled Memo
              </SideNavLink>
            </SideNavItems>
          </SideNav>
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Select Language"
              onClick={() => {}}
              className="fix-icon-position"
            >
              <Translate20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="App Switcher"
              onClick={() => setSwitcher(!switcher)}
              isActive={switcher}
              className="fix-icon-position"
            >
              <AppSwitcher20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <StyledHeaderPanel aria-label="Header Panel" expanded={switcher}>
            <Switcher aria-label="Switcher Container">
              <SwitcherItem
                aria-label="Documentation"
                href="https://lifeni.github.io/i-show-you"
                target="_blank"
                rel="noopener noreferrer"
                className="menu-item"
              >
                <BookmarkFilled16 />
                <span>Documentation</span>
              </SwitcherItem>
              <SwitcherItem
                aria-label="GitHub"
                href="https://github.com/Lifeni/i-show-you"
                target="_blank"
                rel="noopener noreferrer"
                className="menu-item"
              >
                <LogoGithub16 />
                <span>GitHub</span>
              </SwitcherItem>
              <SwitcherItem
                aria-label="GitHub Issues"
                href="https://github.com/Lifeni/i-show-you/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="menu-item"
              >
                <FlagFilled16 />
                <span>Report Issues</span>
              </SwitcherItem>
              <SwitcherDivider />
              <SwitcherItem aria-label="Version" className="menu-item">
                <InformationFilled16 />
                <span>v0.1.0 Alpha</span>
              </SwitcherItem>
              <SwitcherItem aria-label="Clear Data" className="menu-item">
                <CloseFilled16 color="#fa4d56" />
                <span className="danger">Clear All Data</span>
              </SwitcherItem>
            </Switcher>
          </StyledHeaderPanel>
        </StyledHeader>
      )}
    />
  )
}

export default HeaderBar
