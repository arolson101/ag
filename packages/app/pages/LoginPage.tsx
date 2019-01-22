import React from 'react'
import { AppContext } from '../context'
import { LoginForm } from '../forms'

export namespace LoginPage {
  export interface Props {}
}

export class LoginPage extends React.PureComponent<LoginPage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = `LoginPage`

  render() {
    const {
      ui: { Page },
    } = this.context

    return (
      <Page>
        <LoginForm />
      </Page>
    )
  }
}
