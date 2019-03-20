import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { QueryHookResult } from 'react-apollo-hooks'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { Gql, Link, useQuery } from '../components'
import { BankDisplay } from '../components/BankDisplay'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:CalendarPage')

export namespace CalendarPage {
  export interface Props {}
}

const queries = {
  CalendarPage: gql`
    query CalendarPage {
      appDb {
        accounts {
          id
          name
        }
      }
    }
    ${BankDisplay.fragments.BankDisplay}
  ` as Gql<T.CalendarPage.Query, T.CalendarPage.Variables>,
}

const Component: React.FC<
  QueryHookResult<T.CalendarPage.Query, T.CalendarPage.Variables>
> = function CalendarPageComponent({ data, loading }) {
  const {
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page>
      <Text header>Calendar</Text>
      {data &&
        data.appDb &&
        data.appDb.accounts.map(account => <Text key={account.id}>{account.name}</Text>)}
    </Page>
  )
}

const messages = defineMessages({
  tabText: {
    id: 'CalendarPage.tabText',
    defaultMessage: 'Calendar',
  },
  titleText: {
    id: 'CalendarPage.titleText',
    defaultMessage: 'Calendar',
  },
})

export const CalendarPage = Object.assign(
  (props: CalendarPage.Props) => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(CalendarPage.queries.CalendarPage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  },
  {
    id: 'CalendarPage',
    queries,
    Component,
    messages,
  }
)
