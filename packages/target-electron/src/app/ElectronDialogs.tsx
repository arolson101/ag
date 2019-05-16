import { useSelector } from '@ag/core/context'
import { AccountDialog, BankDialog, LoginDialog, PictureDialog } from '@ag/core/dialogs'
import { selectors } from '@ag/core/reducers'
import debug from 'debug'
import React from 'react'

const log = debug('electron:ElectronDialogs')

interface Props {}

export const ElectronDialogs = Object.assign(
  React.memo<Props>(function _ElectronDialogs(props) {
    const dialog = useSelector(selectors.getDialogs)

    return (
      <>
        {dialog.loginDialog && dialog.loginDialog.isOpen && <LoginDialog {...dialog.loginDialog} />}
        {dialog.pictureDialog && dialog.pictureDialog.isOpen && (
          <PictureDialog {...dialog.pictureDialog} />
        )}
        {dialog.bankDialog && dialog.bankDialog.isOpen && <BankDialog {...dialog.bankDialog} />}
        {dialog.accountDialog && dialog.accountDialog.isOpen && (
          <AccountDialog {...dialog.accountDialog} />
        )}
      </>
    )
  }),
  {
    displayName: 'ElectronDialogs',
  }
)
