import { useSelector } from '@ag/core/context'
import {
  AccountPage,
  AccountsPage,
  BillsPage,
  BudgetsPage,
  CalendarPage,
  HomePage,
} from '@ag/core/pages'
import { selectors } from '@ag/core/reducers'
import { Content, Layout } from '@ag/ui-antd'
import { ConnectedRouter } from 'connected-react-router'
import debug from 'debug'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { NavBar, SplitPane } from '../components'

const log = debug('electron:router')

type RouteComponent = React.ComponentType<any> & {
  path: string
}

const routes: RouteComponent[] = [
  HomePage, //
  AccountPage,
  AccountsPage,
  BillsPage,
  BudgetsPage,
  CalendarPage,
]

interface Props {
  hist: HistoryType
}

export const ElectronRouter = Object.assign(
  React.memo<Props>(function _ElectronRouter({ hist }) {
    const fallback = routes[0].path

    const isLoggedIn = useSelector(selectors.isLoggedIn)
    if (!isLoggedIn) {
      return <div>db not open</div>
    }

    return (
      <ConnectedRouter history={hist}>
        <Layout>
          <SplitPane>
            <NavBar />

            <Content style={{ height: '100%' }}>
              <Route
                render={params => {
                  log('route %s %O %O', params.location.pathname, params, hist.entries)
                  return null
                }}
              />
              <Switch>
                {routes.map(Component => (
                  <Route
                    key={Component.path}
                    path={Component.path}
                    exact
                    render={({ match }) => <Component {...match.params} />}
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
      </ConnectedRouter>
    )
  }),
  {
    displayName: 'ElectronRouter',
  }
)
