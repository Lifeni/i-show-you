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
