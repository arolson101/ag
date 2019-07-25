export * from './AccountDialog'
export * from './BankDialog'
export * from './BillDialog'
export * from './LoginDialog'
export * from './PictureDialog'
export * from './TransactionDialog'

import { AccountDialog } from './AccountDialog'
import { BankDialog } from './BankDialog'
import { BillDialog } from './BillDialog'
import { LoginDialog } from './LoginDialog'
import { PictureDialog } from './PictureDialog'
import { TransactionDialog } from './TransactionDialog'

export const appDialogs: Array<React.ComponentType<any>> = [
  AccountDialog, //
  BankDialog,
  LoginDialog,
  PictureDialog,
  BillDialog,
  TransactionDialog,
]
