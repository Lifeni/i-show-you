/// <reference types="react-scripts" />

interface IFileMap {
  id: number
  name: string
  slug: string
  ext?: Array<string>
}

interface IGlobalData {
  isMobile: boolean
  pageId: string
}

interface ITabData {
  name: string
  created_at: string
  updated_at: string
  id: string
  authentication: string
}

interface IFileData {
  name: string
  created_at: string
  updated_at: string
  id: string
  type: string
}

interface IFileAllData {
  name: string
  created_at: string
  updated_at: string
  id: string
  type: string
  content: string
  options: IFileOptions
}

interface IFileIndexData {
  key: string
  header: string
}

interface IFileOptions {
  auto_save: boolean
  word_wrap: boolean
  font_family: string
  font_size: number
  line_height: number
}

interface ITableParams {
  rows
  headers: Array<IFileIndexData>
  getHeaderProps
  getRowProps
  getSelectionProps
  getBatchActionProps
  onInputChange
  selectedRows
}

interface IURLParams {
  id: string
}
declare module 'react-qr-code' {
  import * as React from 'react'

  export interface QRCodeProps {
    value: string
    size?: number // defaults to 128
    bgColor?: string // defaults to '#FFFFFF'
    fgColor?: string // defaults to '#000000'
    level?: 'L' | 'M' | 'Q' | 'H' // defaults to 'L'
  }

  class QRCode extends React.Component<QRCodeProps, any> {}

  export default QRCode
}
