import React from 'react'
import { AppContext } from '../context'

export namespace HomePage {
  export type Props = void
}

export class HomePage extends React.PureComponent<HomePage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'HomePage'

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
