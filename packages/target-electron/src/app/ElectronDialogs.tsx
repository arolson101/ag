import {
  AccountDialog,
  AppContext,
  AppState,
  BankDialog,
  LoginDialog,
  PictureDialog,
} from '@ag/core'
import debug from 'debug'
import React from 'react'
import shallowequal from 'shallowequal'

const log = debug('electron:ElectronDialogs')

interface Props {}

interface State {
  dialog: AppState['dialog']
}

const subState = (state: AppState): State => ({
  dialog: state.dialog,
})

export class ElectronDialogs extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  state: State
  unsubscribe!: () => void

  constructor(props: Props, context: React.ContextType<typeof AppContext>) {
    super(props)
    this.state = subState(context.store.getState() as any)
    this.unsubscribe = context.store.subscribe(() => {
      const state = subState(context.store.getState() as any)
      if (!shallowequal(state, this.state)) {
        this.setState(state)
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { dialog } = this.state

    return (
      <>
        {dialog.loginDialog && <LoginDialog {...dialog.loginDialog} />}
        {dialog.pictureDialog && <PictureDialog {...dialog.pictureDialog} />}
        {dialog.bankDialog && <BankDialog {...dialog.bankDialog} />}
        {dialog.accountDialog && <AccountDialog {...dialog.accountDialog} />}
      </>
    )
  }
}
