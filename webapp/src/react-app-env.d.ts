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

interface IURLParams {
  id: string
}

interface IResponseData {
  message: string
  data?: any
  documentation?: string
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
