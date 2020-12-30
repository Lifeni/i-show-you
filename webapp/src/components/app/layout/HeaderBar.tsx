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
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { GlobalContext } from '../../App'

import { HeaderFileTab, SideNavFileTab } from '../header/FileTab'
import HeaderRightMenu from '../header/HeaderRightMenu'
import HorizontalScroller from '../../global/HorizontalScroller'
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

  .back-home {
    padding: 0 1rem;
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
  const { isMobile } = useContext(GlobalContext)
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
            <HeaderName
              href="/"
              prefix={prefix || 'I Show'}
              className="back-home"
            >
              {title || 'You'}
            </HeaderName>
            {isMobile ? null : (
              <Link to="/new">
                <HeaderGlobalAction
                  aria-label="New File"
                  className="fix-icon-position"
                >
                  <Add20 />
                </HeaderGlobalAction>
              </Link>
            )}
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
