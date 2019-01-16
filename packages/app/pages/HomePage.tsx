import React from 'react'
import { AppContext } from '../context'

export class HomePage extends React.PureComponent {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly route = `/home`
  static readonly link = () => `/home`

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
