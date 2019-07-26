declare interface SQLJS {
  __type: 'sqljs'
}

declare interface Window {
  SQL: SQLJS
}

declare module '*.agz' {
  const data: ArrayBuffer
  export default data
}
