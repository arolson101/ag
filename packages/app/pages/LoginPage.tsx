import { DocumentNode } from 'graphql'
import { filter } from 'graphql-anywhere'
import gql from 'graphql-tag'
import React, { PureComponent } from 'react'
import { LoginForm } from '../components/LoginForm'
import { PageQuery } from '../routes'

export namespace LoginPage {
  export type Params = void
  export interface Props {
    create: boolean
  }
}

export class LoginPage extends PureComponent<LoginPage.Props> {
  static url: string
  static query: PageQuery<LoginPage.Params>

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
