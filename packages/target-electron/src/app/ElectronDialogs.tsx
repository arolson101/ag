import {
  AccountDialog,
  BankDialog,
  CoreState,
  LoginDialog,
  PictureDialog,
  useCoreStore,
} from '@ag/core'
import debug from 'debug'
import React, { useEffect, useState } from 'react'
import shallowequal from 'shallowequal'

const log = debug('electron:ElectronDialogs')

interface Props {}

interface State {
  dialog: CoreState['dialog']
}

const subState = (state: CoreState): State => ({
  dialog: state.dialog,
})

export const ElectronDialogs = Object.assign(
  React.memo<Props>(function _ElectronDialogs(props) {
    const store = useCoreStore()
    const [state, setState] = useState(subState(store.getState() as any))

    useEffect(() => {
      return store.subscribe(() => {
        const nextState = subState(store.getState() as any)
        if (!shallowequal(state, nextState)) {
          setState(nextState)
        }
      })
    }, [store])

    const { dialog } = state

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
