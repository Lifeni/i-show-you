import { Play20 } from '@carbon/icons-react'
import { Button } from 'carbon-components-react'
import React, { useContext, useEffect, useState } from 'react'
import store from 'store2'
import { GlobalContext } from '../../App'

const canRunList = ['HTML', 'JavaScript', 'Markdown']

const RunFile = (props: { type: IFileMap; updateView: Function }) => {
  const { type, updateView } = props
  const { pageId } = useContext(GlobalContext)
  const currentPage = store.namespace(pageId)
  const [view, setView] = useState('none')
  const [canRun, setCanRun] = useState(false)

  useEffect(() => {
    if (canRunList.includes(type.name)) {
      setCanRun(true)
    } else {
      setCanRun(false)
    }
  }, [type.name])

  const handleRunFile = (lang: string) => {
    if (lang === 'JavaScript') {
      const ans = window.confirm(
        'Executing JavaScript code is a dangerous operation, you better know what you are doing. \n执行 JavaScript 代码是一个危险操作，你最好知道你在干什么。'
      )
      if (ans) {
        eval(currentPage.get('content'))
      }
    } else if (lang === 'HTML') {
      if (view === 'html') {
        updateView('none')
        setView('none')
      } else {
        updateView('html')
        setView('html')
      }
    } else if (lang === 'Markdown') {
      if (view === 'markdown') {
        updateView('none')
        setView('none')
      } else {
        updateView('markdown')
        setView('markdown')
      }
    }
  }

  return (
    <>
      {canRun && (
        <Button
          hasIconOnly
          renderIcon={Play20}
          tooltipAlignment="center"
          tooltipPosition="bottom"
          iconDescription="Preview File"
          kind="ghost"
          size="field"
          onClick={() => handleRunFile(type.name)}
        />
      )}
    </>
  )
}

export default RunFile
