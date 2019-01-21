import React from 'react'
import { AppContext } from '../context'

export namespace BankEditPage {
  export interface Props {
    bankId?: string
  }
}

export class BankEditPage extends React.PureComponent<BankEditPage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'BankEditPage'

  render() {
    const { ui } = this.context
    const { Page, Text } = ui
    const { bankId } = this.props

    return (
      <Page>
        <Text>bank {bankId ? 'edit' : 'create'}</Text>
      </Page>
    )
  }
}
