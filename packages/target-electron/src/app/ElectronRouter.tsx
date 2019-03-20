import {
  AccountsPage,
  actions,
  BillsPage,
  BudgetsPage,
  CalendarPage,
  CoreContext,
  Gql,
  HomePage,
  MenuBar,
  useMutation,
  useQuery,
} from '@ag/core'
import { Content, Header, Icon, Layout, Menu, PageHeader, Sider } from '@ag/ui-antd'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import debug from 'debug'
import gql from 'graphql-tag'
import { parse } from 'query-string'
import React, { useCallback, useContext } from 'react'
import { Redirect, Route, Router as ReactRouter, Switch } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import * as T from '../electron-graphql-types'
import { history } from '../reducers'

// see target-react-native/src/icons.ts
import {
  faCalendarAlt as iconCalendar,
  faHome as iconHome,
  faMoneyCheckAlt as iconBills,
  faPiggyBank as iconBudgets,
  faUniversity as iconAccounts,
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'

const log = debug('electron:router')

const queries = {
  SidebarWidth: gql`
    query SidebarWidth {
      appDb {
        get(key: "sidebarWidth") {
          key
          value
        }
      }
    }
  ` as Gql<T.SidebarWidth.Query, T.SidebarWidth.Variables>,
}

const mutations = {
  SetSidebarWidth: gql`
    mutation SetSidebarWidth($value: String!) {
      set(key: "sidebarWidth", value: $value) {
        key
        value
      }
    }
  ` as Gql<T.SetSidebarWidth.Mutation, T.SetSidebarWidth.Variables>,
}

type ComponentWithId = React.ComponentType<any> & {
  id: string
  messages: {
    titleText: FormattedMessage.MessageDescriptor
  }
}

const routes: ComponentWithId[] = [
  HomePage, //
  AccountsPage,
  BillsPage,
  BudgetsPage,
  CalendarPage,
]

interface Props {}

const FontIcon: React.FC<{ icon: IconDefinition }> = ({ icon }) => (
  <Icon component={() => <FontAwesomeIcon icon={icon} />} />
)

const url = (page: ComponentWithId) => `/${page.id}`

export const ElectronRouter: React.FC<Props> = props => {
  const { dispatch, intl } = useContext(CoreContext)
  const { loading, data, error } = useQuery(queries.SidebarWidth)
  const setSidebarWidthMutation = useMutation(mutations.SetSidebarWidth, {
    refetchQueries: [{ query: queries.SidebarWidth }],
  })
  const setSidebarWidth = React.useCallback(
    (width: number) => {
      log('setSidebarWidth %d', width)
      setSidebarWidthMutation({ variables: { value: width.toString() } })
    },
    [setSidebarWidthMutation]
  )

  const sidebarWidth =
    !loading && data && data.appDb && data.appDb.get ? parseFloat(data.appDb.get.value) : 150
  log('ElectronRouter %o', data)

  const fallback = url(routes[0])

  return (
    <ReactRouter history={history}>
      <Layout>
        <SplitPane
          split='vertical'
          minSize={50}
          maxSize={500}
          size={sidebarWidth}
          onDragFinished={setSidebarWidth}
          resizerStyle={{
            background: '#000',
            opacity: 0.1,
            zIndex: 1,
            boxSizing: 'border-box',
            backgroundClip: 'padding-box',
            cursor: 'col-resize',
            width: 11,
            margin: '0 -5px',
            borderLeft: '5px solid rgba(255, 255, 255, 0)',
            borderRight: '5px solid rgba(255, 255, 255, 0)',
          }}
        >
          <div style={{ overflow: 'auto', height: '100vh' }}>
            <Route>
              {({ location }) => {
                log('location: %o', location)
                return (
                  <Menu selectable selectedKeys={[location.pathname]} mode='inline'>
                    <Menu.Item
                      key={url(HomePage)} //
                      onClick={() => dispatch(actions.nav.home())}
                    >
                      <FontIcon icon={iconHome} />
                      <span>Home</span>
                    </Menu.Item>

                    <Menu.Item
                      key={url(AccountsPage)}
                      onClick={() => dispatch(actions.nav.accounts())}
                    >
                      <FontIcon icon={iconAccounts} />
                      <span>Accounts</span>
                    </Menu.Item>

                    <Menu.Item
                      key={url(BillsPage)} //
                      onClick={() => dispatch(actions.nav.bills())}
                    >
                      <FontIcon icon={iconBills} />
                      <span>Bills</span>
                    </Menu.Item>

                    <Menu.Item
                      key={url(BudgetsPage)} //
                      onClick={() => dispatch(actions.nav.budgets())}
                    >
                      <FontIcon icon={iconBudgets} />
                      <span>Budgets</span>
                    </Menu.Item>

                    <Menu.Item
                      key={url(CalendarPage)} //
                      onClick={() => dispatch(actions.nav.calendar())}
                    >
                      <FontIcon icon={iconCalendar} />
                      <span>Calendar</span>
                    </Menu.Item>
                  </Menu>
                )
              }}
            </Route>

            <MenuBar />
          </div>

          <Content style={{ overflow: 'auto', height: '100vh' }}>
            <Switch>
              {routes.map(Component => (
                <Route
                  key={Component.id}
                  path={`/${Component.id}`}
                  exact
                  render={({ location }) => (
                    <Layout>
                      <PageHeader title={intl.formatMessage(Component.messages.titleText)}>
                        <Component {...parse(location.search)} />
                      </PageHeader>
                    </Layout>
                  )}
                />
              ))}
              <Route
                render={({ location }) => {
                  log(
                    `"%s" (%O) not found- redirecting to ${fallback}`,
                    location.pathname,
                    location
                  )
                  return <Redirect to={fallback} />
                }}
              />
            </Switch>
          </Content>
        </SplitPane>
      </Layout>
    </ReactRouter>
  )
}
