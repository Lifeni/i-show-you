import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const HorizontalScroller = (props: { children: ReactNode }) => {
  const children = props.children

  useEffect(() => {
    const scroller = document.querySelector('#horizontal-scroller')

    if (scroller) {
      scroller.addEventListener('wheel', (e: Event) => {
        window.requestAnimationFrame(() => {
          let y = (e as WheelEvent).deltaY
          if (y !== 0) {
            let value = 30
            if (y < 0) {
              value = -value
            }
            scroller.scrollLeft += value
          }
        })
      })
    }
  }, [])

  return <Container id="horizontal-scroller">{children}</Container>
}

export default HorizontalScroller
