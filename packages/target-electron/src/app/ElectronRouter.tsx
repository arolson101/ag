import {
  AccountPage,
  AccountsPage,
  BillsPage,
  BudgetsPage,
  CalendarPage,
  HomePage,
  selectors,
  useSelector,
} from '@ag/core'
import { Content, Layout } from '@ag/ui-antd'
import debug from 'debug'
import React from 'react'
import { Redirect, Route, Router as ReactRouter, Switch } from 'react-router-dom'
import { NavBar, SplitPane } from '../components'
import { electronSelectors } from '../reducers'

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

interface Props {}

export const ElectronRouter = React.memo<Props>(function _ElectronRouter(props) {
  const fallback = routes[0].path

  const history = useSelector(electronSelectors.getHistory)
  const isLoggedIn = useSelector(selectors.isLoggedIn)
  if (!isLoggedIn) {
    return <div>db not open</div>
  }

  return (
    <ReactRouter history={history}>
      <Layout>
        <SplitPane>
          <NavBar />

          <Content>
            <Route
              render={params => {
                log('route %s %O %O', params.location.pathname, params, history.entries)
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
    </ReactRouter>
  )
})
