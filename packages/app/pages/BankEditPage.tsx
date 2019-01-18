import React from 'react'
import { AppContext } from '../context'

export namespace BankEditPage {
  export interface Props {
    bankId: string
  }
}

export class BankEditPage extends React.PureComponent<BankEditPage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly route = `/bank/:bankId`
  static readonly link = ({ bankId }: BankEditPage.Props) => `/bank/${bankId}`

  render() {
    const { ui } = this.context
    const { Page, Text } = ui

    return (
      <Page>
        <Text>home page</Text>
      </Page>
    )
  }
}
