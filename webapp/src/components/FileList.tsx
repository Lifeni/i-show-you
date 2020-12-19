import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import FileCard from './FileCard'
import HomeActions from './HomeActions'
import { MobileTipsInline } from './MobileTips'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 36px;
  overflow: auto;

  @media (max-width: 672px) {
    height: calc(100vh - 48px);
  }

  @media (max-width: 410px) {
    padding: 24px;
  }
`

const EmptyBox = styled.div`
  max-width: 960px;
  margin: 0 auto 12px auto;
  height: calc(100vh - 180px);
  min-height: 50vh;
  padding: 48px;
  border: dashed 2px #e0e0e0;
  color: #616161;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FileBox = styled.div`
  max-width: 960px;
  margin: 0 auto 12px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`

const FileList = () => {
  const tabs = store.namespace('tabs')
  const [redirect, setRedirect] = useState('200')

  const [tabData, setTabData] = useState(
    Object.values(tabs.getAll())
      .map(v => JSON.parse(v))
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
  )

  const [isMobile, setMobile] = useState(false)
  useEffect(() => {
    const checkWidth = () => {
      window.requestAnimationFrame(() => {
        setMobile(window.innerWidth < 672)
      })
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)

    return () => {
      window.removeEventListener('resize', checkWidth)
    }
  }, [])

  useEffect(() => {
    const updateTabData = () => {
      setTabData(
        Object.values(tabs.getAll())
          .map(v => JSON.parse(v))
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
      )
    }

    window.addEventListener('storage', updateTabData)

    return () => {
      window.removeEventListener('storage', updateTabData)
    }
  }, [tabs])

  return (
    <Container>
      {redirect === '200' ? null : <Redirect to={redirect} />}
      {isMobile ? <MobileTipsInline /> : <HomeActions />}
      {tabData.length === 0 ? (
        <EmptyBox>No File</EmptyBox>
      ) : (
        <FileBox>
          {tabData.map(data => (
            <FileCard
              data={data}
              setRedirect={setRedirect}
              key={data.created_at}
            />
          ))}
        </FileBox>
      )}
    </Container>
  )
}

export default FileList
