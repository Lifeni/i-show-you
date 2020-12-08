/// <reference types="react-scripts" />

interface IFileMap {
  id: number
  name: string
  slug: string
  ext?: Array<string>
}

interface IGlobalData {
  uuid: string
  isMobile: boolean
}

interface IURLParams {
  id: string
}
