import {
  AppSwitcher20,
  BookmarkFilled16,
  Close20,
  CloseFilled16,
  FlagFilled16,
  InformationFilled16,
  LogoGithub16,
} from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  HeaderPanel,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
} from 'carbon-components-react'
import React, { useState } from 'react'
import styled from 'styled-components'

const StyledHeaderPanel = styled(HeaderPanel)`
  height: fit-content;
  padding-bottom: 1rem;
`

const HeaderRightMenu = () => {
  const [switcher, setSwitcher] = useState(false)

  return (
    <>
      <HeaderGlobalAction
        aria-label="App Switcher"
        onClick={() => setSwitcher(!switcher)}
        isActive={switcher}
        className="fix-icon-position"
      >
        {switcher ? <Close20 /> : <AppSwitcher20 />}
      </HeaderGlobalAction>
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
    </>
  )
}

export default HeaderRightMenu
