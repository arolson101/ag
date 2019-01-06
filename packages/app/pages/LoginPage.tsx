import gql from 'graphql-tag'
import React, { PureComponent } from 'react'
import { AppContext } from '../context'
import { LoginPageQuery, LoginPageVariables } from '../graphql-types'
// import { LoginForm } from '../components/LoginForm'
import { PageQuery } from '../routes'

export class LoginPage extends PureComponent<LoginPageQuery> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static url: string
  static query: PageQuery<LoginPageVariables>

  static readonly propTypes = {}

  render() {
    const {
      ui: { Page, Text },
      intl,
    } = this.context

    return (
      <Page>
        <Text>{intl.formatMessage(null as any)}</Text>
      </Page>
    )
  }
}

LoginPage.url = '/login'

LoginPage.query = gql`
  query LoginPage {
    allDbs {
      dbId
      name
    }
  }
`
