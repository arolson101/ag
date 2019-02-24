export * from './AccountDialog'
export * from './BankDialog'
export * from './LoginDialog'
export * from './PictureDialog'

import { AccountDialog } from './AccountDialog'
import { BankDialog } from './BankDialog'
import { LoginDialog } from './LoginDialog'
import { PictureDialog } from './PictureDialog'

export const appDialogs: Array<React.ComponentType<any>> = [
  AccountDialog, //
  BankDialog,
  LoginDialog,
  PictureDialog,
]
