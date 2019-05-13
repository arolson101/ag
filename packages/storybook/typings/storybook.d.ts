declare interface SQLJS {
  __type: 'sqljs'
}

declare interface Window {
  SQL: SQLJS
}

declare interface XlsxData {
  __type: 'xlsx'
}

declare module '*.xlsx' {
  const data: XlsxData
  export default data
}
