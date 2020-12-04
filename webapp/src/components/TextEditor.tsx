import React from 'react'
import Editor from '@monaco-editor/react'

const editorOptions = {
  minimap: {
    enabled: false,
  },
}

const TextEditor = () => {
  return (
    <>
      <Editor
        width="100%"
        height="50vh"
        className="editor"
        language="javascript"
        options={editorOptions}
      />
    </>
  )
}

export default TextEditor
