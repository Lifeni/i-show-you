import React, { createContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { validate } from 'uuid'
import HeaderBar from './components/HeaderBar'
import TextEditor from './components/TextEditor'

const context: IGlobalData = {
  uuid: '',
  isMobile: false,
}
const DataContext = createContext(context)

const App = () => {
  const [uuid, setUuid] = useState('')
  const [mobile, setMobile] = useState(false)

  let { id }: IURLParams = useParams()
  if (validate(id)) {
    setUuid(id)
  }

  const checkMobile = () => {
    if (window.innerWidth < 720) {
      setMobile(true)
    } else {
      setMobile(false)
    }
  }

  window.addEventListener('DOMContentLoaded', checkMobile)

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(checkMobile)
  })

  return (
    <>
      <DataContext.Provider value={{ uuid: uuid, isMobile: mobile }}>
        <HeaderBar />
        <TextEditor />
      </DataContext.Provider>
    </>
  )
}

export default App
export { DataContext }
