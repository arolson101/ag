declare module 'react-electron-menu' {
  import React from 'react'

  export class Provider extends React.Component<{ electron: any }> {}

  export class WindowMenu extends React.Component {}
  export class MenuItem extends React.Component<{
    checked?: boolean
    onClick?: () => any
    enabled?: boolean
    label: string
    visible?: boolean
  }> {}

  export class DefaultEditMenu extends React.Component {}
  export class DefaultFileMenu extends React.Component {}
  export class DefaultWindowMenu extends React.Component {}
}
