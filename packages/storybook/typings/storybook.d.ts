declare interface SQLJS {
  __type: 'sqljs'
}

declare interface Window {
  SQL: SQLJS
}

declare interface XlsxData {
  __type: 'xlsx'
}

declare interface OdsData {
  __type: 'ods'
}

declare module '*.xlsx' {
  const data: XlsxData
  export default data
}

declare module '*.ods' {
  const data: OdsData
  export default data
}

declare module '*.zip' {
  const data: ArrayBuffer
  export default data
}
