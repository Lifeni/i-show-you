import { Cloud16, Screen16, Time16 } from '@carbon/icons-react'
import { ClickableTile } from 'carbon-components-react'
import dayjs from 'dayjs'
import React from 'react'
import store from 'store2'
import styled from 'styled-components'

const StyledTile = styled(ClickableTile)`
  width: 100%;
  min-width: 240px;
  max-width: 300px;
  margin: 8px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 4px;

  @media (max-width: 672px) {
    max-width: unset;
  }

  div {
    width: 100%;
    padding: 20px 24px 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    svg {
      min-width: 16px;
      min-height: 16px;
      margin: 0;
    }

    time,
    span {
      display: flex;
      align-items: center;
      svg {
        margin: 0 8px 0 0;
      }
    }
  }

  h2 {
    width: 100%;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  pre {
    position: relative;
    width: calc(100% - 24px);
    height: calc((276px / 16) * 9);
    margin: 8px 12px 12px 12px;
    padding: 10px 12px;
    font-size: 0.75rem;
    line-height: 1rem;
    overflow: hidden;
    white-space: pre;
    background-color: #f4f4f4;
    transition: all 0.15s cubic-bezier(0.2, 0, 0.38, 0.9);

    ::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 100;
      width: 100%;
      height: 0;
      display: flex;
      box-shadow: 0 0 24px 24px #f4f4f4;
      transition: all 0.15s cubic-bezier(0.2, 0, 0.38, 0.9);
    }
  }

  time {
    white-space: nowrap;
  }

  :hover pre {
    color: #616161;
    background-color: #e5e5e5;

    ::after {
      box-shadow: 0 0 24px 24px #e5e5e5;
    }
  }
`

const FileCard = (props: {
  data: ITabData
  setRedirect: React.Dispatch<React.SetStateAction<string>>
}) => {
  const { data, setRedirect } = props
  return (
    <StyledTile
      handleClick={() => {
        setRedirect(`/${data.id}`)
      }}
    >
      <div>
        {data.authentication === 'owner' ? (
          <span>
            <Screen16 />
            Owner
          </span>
        ) : (
          <span>
            <Cloud16 />
            Shared
          </span>
        )}
        <time>
          <Time16 />
          {dayjs(data.updated_at).fromNow()}
        </time>
      </div>

      <h2>{data.name || 'Untitled File'}</h2>

      <pre>
        <code>
          {store.namespace(data.id).get('content')
            ? store.namespace(data.id).get('content')
            : ''}
        </code>
      </pre>
    </StyledTile>
  )
}

export default FileCard
