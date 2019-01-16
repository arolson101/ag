import React from 'react'
import { AppContext } from '../context'

interface Props {
  bankId: string
}

export class BankEditPage extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly route = `/bank/:bankId`
  static readonly link = ({ bankId }: Props) => `/bank/${bankId}`

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
