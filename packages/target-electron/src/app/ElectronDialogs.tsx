import {
  AccountDialog,
  BankDialog,
  LoginDialog,
  PictureDialog,
  selectors,
  useSelector,
} from '@ag/core'
import debug from 'debug'
import React from 'react'

const log = debug('electron:ElectronDialogs')

interface Props {}

export const ElectronDialogs = Object.assign(
  React.memo<Props>(function _ElectronDialogs(props) {
    const dialog = useSelector(selectors.getDialogs)

    return (
      <>
        {dialog.loginDialog && <LoginDialog {...dialog.loginDialog} />}
        {dialog.pictureDialog && <PictureDialog {...dialog.pictureDialog} />}
        {dialog.bankDialog && <BankDialog {...dialog.bankDialog} />}
        {dialog.accountDialog && <AccountDialog {...dialog.accountDialog} />}
      </>
    )
  }),
  {
    displayName: 'ElectronDialogs',
  }
)
