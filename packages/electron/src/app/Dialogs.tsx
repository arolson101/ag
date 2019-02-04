import { AccountDialog, AppContext, AppState, BankDialog, LoginDialog } from '@ag/app'
import debug from 'debug'
import React from 'react'
import shallowequal from 'shallowequal'

const log = debug('electron:Dialogs')

interface Props {}

interface State {
  dialog: AppState['dialog']
}

const subState = (state: AppState): State => ({
  dialog: state.dialog,
})

export class Dialogs extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  state: State
  unsubscribe!: () => void

  constructor(props: Props, context: React.ContextType<typeof AppContext>) {
    super(props)
    log('constructor')
    this.state = subState(context.store.getState() as any)
    this.unsubscribe = context.store.subscribe(() => {
      const state = subState(context.store.getState() as any)
      if (!shallowequal(state, this.state)) {
        this.setState(state)
      }
    })
  }

  componentWillUnmount() {
    log('componentWillUnmount')
    this.unsubscribe()
  }

  render() {
    log('render')
    const { dialog } = this.state

    return (
      <>
        <LoginDialog isOpen={!!dialog.login} />
        {dialog.bankDialog && <BankDialog {...dialog.bankDialog} />}
        {dialog.accountDialog && <AccountDialog {...dialog.accountDialog} />}
      </>
    )
  }
}
