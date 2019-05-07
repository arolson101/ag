import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { CoreContext, useIntl } from '../context'
import * as T from '../graphql-types'

const log = debug('core:HomePage')

interface Props {}
type ComponentProps = QueryHookResult<T.HomePage.Query, T.HomePage.Variables>

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

const Component = React.memo<ComponentProps>(({ data, loading }) => {
  const intl = useIntl()
  const {
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page title={intl.formatMessage(messages.titleText)}>
      <Text header>Home</Text>
    </Page>
  )
})
Component.displayName = 'HomePage.Component'

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

const path = '/home'
const route = docuri.route<void, string>(path)

export const HomePage = Object.assign(
  React.memo<Props>(props => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(queries.HomePage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  }),
  {
    displayName: 'HomePage',
    queries,
    Component,
    messages,
    path,
    route,
  }
)
