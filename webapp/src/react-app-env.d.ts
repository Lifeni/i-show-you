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

interface IURLParams {
  id: string
}

interface IResponseData {
  message: string
  data?: any
  documentation?: string
}
