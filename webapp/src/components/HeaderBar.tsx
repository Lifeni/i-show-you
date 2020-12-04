import React from 'react'

import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  SideNav,
  SideNavItems,
  SideNavLink,
  SkipToContent,
} from 'carbon-components-react'

import { Document16, LogoGithub20 } from '@carbon/icons-react'

const HeaderBar = () => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="Header of I Show You">
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
            Untitled Memo
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
          <HeaderGlobalAction aria-label="GitHub" onClick={() => {}}>
            <LogoGithub20 />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
    )}
  />
)

export default HeaderBar
