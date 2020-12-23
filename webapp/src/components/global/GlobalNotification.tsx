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
  }

  svg + div {
    gap: 4px;
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

const GlobalNotification = (props: { options: INoticeOptions }) => {
  const { options } = props

  return (
    <NotificationWrapper style={{ zIndex: new Date().getTime() }}>
      {options.open ? (
        <InlineNotification
          kind={options.kind as NotificationKind}
          title={options.title}
          subtitle={options.subtitle}
          iconDescription="Close Notification"
          onCloseButtonClick={() => {
            if (options.close) {
              options.close()
            }
          }}
        />
      ) : null}
    </NotificationWrapper>
  )
}

export default GlobalNotification
