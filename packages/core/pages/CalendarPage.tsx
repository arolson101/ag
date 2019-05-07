import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { CoreContext, useIntl } from '../context'
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
  const intl = useIntl()
  const {
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

const path = '/calendar'
const route = docuri.route<void, string>(path)

export const CalendarPage = Object.assign(
  React.memo<Props>(props => {
    const q = useQuery(CalendarPage.queries.CalendarPage)

    return (
      <>
        <ErrorDisplay error={q.error} />
        <Component {...q} />
      </>
    )
  }),
  {
    displayName: 'CalendarPage',
    queries,
    Component,
    messages,
    path,
    route,
  }
)
