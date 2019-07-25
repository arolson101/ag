import { useSelector } from '@ag/core/context'
import {
  AccountDialog,
  BankDialog,
  BillDialog,
  LoginDialog,
  PictureDialog,
  TransactionDialog,
} from '@ag/core/dialogs'
import { selectors } from '@ag/core/reducers'
import debug from 'debug'
import React from 'react'

const log = debug('electron:ElectronDialogs')

interface Props {}

export const ElectronDialogs = Object.assign(
  React.memo<Props>(function _ElectronDialogs(props) {
    const dialog = useSelector(selectors.dialogs)

    return (
      <>
        {dialog.loginDialog && <LoginDialog {...dialog.loginDialog} />}
        {dialog.pictureDialog && <PictureDialog {...dialog.pictureDialog} />}
        {dialog.bankDialog && <BankDialog {...dialog.bankDialog} />}
        {dialog.accountDialog && <AccountDialog {...dialog.accountDialog} />}
        {dialog.transactionDialog && <TransactionDialog {...dialog.transactionDialog} />}
        {dialog.billDialog && <BillDialog {...dialog.billDialog} />}
      </>
    )
  }),
  {
    displayName: 'ElectronDialogs',
  }
)
