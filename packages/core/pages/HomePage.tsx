import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useIntl, useUi } from '../context'
import * as T from '../graphql-types'

const log = debug('core:HomePage')

interface Props {}
type ComponentProps = QueryHookResult<T.HomePage.Query, T.HomePage.Variables>

const queries = {
  HomePage: gql`
    query HomePage {
      banks {
        id
      }
    }
  ` as Gql<T.HomePage.Query, T.HomePage.Variables>,
}

const Component = Object.assign(
  React.memo<ComponentProps>(function _HomePage_Component({ data, loading }) {
    const intl = useIntl()
    const { Page, Row, Text } = useUi()

    return (
      <Page title={intl.formatMessage(messages.titleText)}>
        <Text header>Home</Text>
      </Page>
    )
  }),
  {
    displayName: 'HomePage.Component',
  }
)

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
  React.memo<Props>(function _HomePage(props) {
    const q = useQuery(queries.HomePage)

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
