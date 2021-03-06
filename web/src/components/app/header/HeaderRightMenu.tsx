import {
  BookmarkFilled16,
  Close20,
  CloseFilled16,
  FlagFilled16,
  InformationFilled16,
  LogoGithub16,
  StarFilled16,
  Switcher20,
  UserAvatarFilled16,
} from '@carbon/icons-react'
import {
  HeaderGlobalAction,
  HeaderPanel,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
} from 'carbon-components-react'
import React, { useState } from 'react'
import store from 'store2'
import packageFile from '../../../../package.json'

const HeaderRightMenu = () => {
  const [switcher, setSwitcher] = useState(false)

  const handleClearAllData = () => {
    const ans = window.confirm('Really?')
    if (ans) {
      store.clearAll()
      window.location.href = '/'
    }
  }

  return (
    <>
      <HeaderGlobalAction
        aria-label="App Switcher"
        onClick={() => setSwitcher(!switcher)}
        isActive={switcher}
        className="fix-icon-position"
      >
        {switcher ? <Close20 /> : <Switcher20 />}
      </HeaderGlobalAction>
      <HeaderPanel aria-label="Header Panel" expanded={switcher}>
        <Switcher aria-label="Switcher Container">
          <SwitcherItem aria-label="Home" className="menu-item" href="/">
            <StarFilled16 />
            <span>Home</span>
          </SwitcherItem>
          <SwitcherItem aria-label="Admin" className="menu-item" href="/admin">
            <UserAvatarFilled16 />
            <span>Admin</span>
          </SwitcherItem>

          <SwitcherDivider />
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
            <span>v{packageFile.version}</span>
          </SwitcherItem>
          <SwitcherItem
            aria-label="Clear Data"
            className="menu-item"
            onClick={handleClearAllData}
          >
            <CloseFilled16 color="#fa4d56" />
            <span className="danger">Clear All Data</span>
          </SwitcherItem>
        </Switcher>
      </HeaderPanel>
    </>
  )
}

export default HeaderRightMenu
