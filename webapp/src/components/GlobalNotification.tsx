import { InlineNotification, NotificationKind } from 'carbon-components-react'
import React from 'react'
import styled from 'styled-components'

const NotificationWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  bottom: -72px;
  left: 50%;
  transform: translateX(-50%);
  animation: show 0.25s ease forwards;

  p {
    padding: 0 1rem 0 0;
    line-height: 1.5;
  }

  @keyframes show {
    from {
      bottom: -72px;
    }
    to {
      bottom: 24px;
    }
  } ;
`

const GlobalNotification = (props: {
  open: boolean
  close: Function
  kind: NotificationKind
  title: string
  subtitle: string
}) => {
  const { open, close, kind, title, subtitle } = props

  return (
    <NotificationWrapper>
      {open ? (
        <InlineNotification
          kind={kind as NotificationKind}
          title={title}
          subtitle={subtitle}
          iconDescription="Close Notification"
          onCloseButtonClick={() => close()}
        />
      ) : null}
    </NotificationWrapper>
  )
}

export default GlobalNotification
