import gql from 'graphql-tag'
import React from 'react'
import * as T from '../graphql-types'
import { AppQuery } from './AppQuery'
import { Gql } from './Gql'

const queries = {
  loggedIn: gql`
    query IsLoggedIn {
      appDb {
        loggedIn
      }
    }
  ` as Gql<T.IsLoggedIn.Query, T.IsLoggedIn.Variables>,
}

interface Props {
  children: (isLoggedIn: boolean) => React.ReactNode
}

export class IsLoggedIn extends React.PureComponent<Props> {
  render() {
    return (
      <AppQuery query={queries.loggedIn}>
        {({ appDb }) => {
          return this.props.children(!!appDb && appDb.loggedIn)
        }}
      </AppQuery>
    )
  }
}

export namespace IsLoggedIn {
  export const query = queries.loggedIn
}
