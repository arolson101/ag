import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { QueryHookResult } from 'react-apollo-hooks'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { Gql, Link, useQuery } from '../components'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:HomePage')

export namespace HomePage {
  export interface Props {}
}

const queries = {
  HomePage: gql`
    query HomePage {
      appDb {
        banks {
          id
        }
      }
    }
  ` as Gql<T.HomePage.Query, T.HomePage.Variables>,
}

const Component: React.FC<
  QueryHookResult<T.HomePage.Query, T.HomePage.Variables>
> = function HomePageComponent({ data, loading }) {
  const {
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page>
      <Text header>Home</Text>
    </Page>
  )
}

const messages = defineMessages({
  tabText: {
    id: 'HomePage.tabText',
    defaultMessage: 'Home',
  },
  titleText: {
    id: 'HomePage.titleText',
    defaultMessage: 'Home',
  },
})

export const HomePage = Object.assign(
  (props: HomePage.Props) => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(HomePage.queries.HomePage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  },
  {
    id: 'HomePage',
    queries,
    Component,
    messages,
  }
)
