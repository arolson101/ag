import gql from 'graphql-tag'
import React, { PureComponent } from 'react'
import { LoginPageQuery, LoginPageVariables } from '../graphql-types'
// import { LoginForm } from '../components/LoginForm'
import { PageQuery } from '../routes'

export class LoginPage extends PureComponent<LoginPageQuery> {
  static url: string
  static query: PageQuery<LoginPageVariables>

  static readonly propTypes = {}

  render() {
    return <>{/* <LoginForm entry={filter(LoginForm.fragments.entry, entry)} /> */}</>
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
