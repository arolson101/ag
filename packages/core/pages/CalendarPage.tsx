import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { QueryHookResult } from 'react-apollo-hooks'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { Gql, Link, useQuery } from '../components'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:CalendarPage')

interface Props {}
type ComponentProps = QueryHookResult<T.CalendarPage.Query, T.CalendarPage.Variables>

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
  ` as Gql<T.CalendarPage.Query, T.CalendarPage.Variables>,
}

const Component = React.memo<ComponentProps>(({ data, loading }) => {
  const {
    intl,
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page title={intl.formatMessage(messages.titleText)}>
      <Text header>Calendar</Text>
      {data &&
        data.appDb &&
        data.appDb.accounts.map(account => <Text key={account.id}>{account.name}</Text>)}
    </Page>
  )
})
Component.displayName = 'CalendarPage.Component'

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
  React.memo<Props>(props => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(CalendarPage.queries.CalendarPage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  }),
  {
    id: 'CalendarPage',
    queries,
    Component,
    messages,
  }
)
