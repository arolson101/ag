declare module 'react-electron-menu' {
  import React from 'react'

  export class Provider extends React.Component<{ electron: any }> {}

  export class WindowMenu extends React.Component {}
  export class MenuItem extends React.Component<{
    label?: string
    role?: string
    type?: string
    accelerator?: string
    icon?: string
    checked?: boolean
    enabled?: boolean
    onClick?: () => any
  }> {}

  export class DefaultFileMenu extends React.Component<{
    appName: string
    onAbout: () => any
  }> {}
  export class DefaultEditMenu extends React.Component {}
  export class DefaultWindowMenu extends React.Component {}
}
