import React from 'react'
import { AppContext } from '../context'
import { BankForm } from '../forms'

export namespace BankEditPage {
  export interface Props {
    bankId: string
  }
}

export class BankEditPage extends React.PureComponent<BankEditPage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'BankEditPage'

  render() {
    const {
      ui: { Page },
    } = this.context

    return (
      <Page>
        <BankForm bankId={this.props.bankId} />
      </Page>
    )
  }
}
