import React from 'react'
import { AppContext } from '../context'
import { BankForm } from '../forms'

export namespace BankCreatePage {
  export interface Props {}
}

export class BankCreatePage extends React.PureComponent<BankCreatePage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'BankCreatePage'

  render() {
    const {
      ui: { Page },
    } = this.context

    return (
      <Page>
        <BankForm />
      </Page>
    )
  }
}
