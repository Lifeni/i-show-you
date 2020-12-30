import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import store from 'store2'
import styled from 'styled-components'
import { isMobile as check } from '../../utils/is-mobile'
import FileCard from './FileCard'
import HomeActions from './HomeActions'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 36px;
  overflow: auto;

  @media (max-width: 672px) {
    height: calc(100vh - 48px);
  }

  @media (max-width: 410px) {
    padding: 12px 8px 0 8px;
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
  max-width: 976px;
  margin: 0 auto 12px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const FileList = () => {
  const tabs = store.namespace('tabs')
  const [redirect, setRedirect] = useState('200')

  const getTabData = (): Array<any> => {
    return Object.values(tabs.getAll()).sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }

  const [tabData, setTabData] = useState(getTabData())
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      window.requestAnimationFrame(() => {
        setMobile(check)
      })
    }

    const checkTabData = () => {
      setTabData(getTabData())
    }

    checkWidth()
    checkTabData()

    window.addEventListener('resize', checkWidth)
    return () => {
      window.removeEventListener('resize', checkWidth)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      {redirect === '200' ? null : <Redirect to={redirect} />}
      {isMobile ? null : <HomeActions />}
      {tabData.length === 0 ? (
        <EmptyBox>No File</EmptyBox>
      ) : (
        <FileBox>
          {tabData.map(data => (
            <FileCard data={data} setRedirect={setRedirect} key={data.id} />
          ))}
        </FileBox>
      )}
    </Container>
  )
}

export default FileList
