import { AppContext, RouterProps } from '@ag/app'
import { BankEditPage, HomePage, LoginPage } from '@ag/app/pages'
import debug from 'debug'
import { parse } from 'query-string'
import React from 'react'
import { Redirect, Route, Router as ReactRouter, Switch } from 'react-router-dom'
import { history } from '../reducers'

const log = debug('electron:router')
log.enabled = process.env.NODE_ENV !== 'production'

type ComponentWithId = React.ComponentType & { id: string }

const loggedOutRoutes: ComponentWithId[] = [
  LoginPage, //
]

const loggedInRoutes: ComponentWithId[] = [
  HomePage, //
  BankEditPage,
]

export class ElectronRouter extends React.PureComponent<RouterProps> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { isLoggedIn } = this.props
    const routes = isLoggedIn ? loggedInRoutes : loggedOutRoutes
    const fallback = `/${routes[0].id}`

    return (
      <ReactRouter history={history}>
        <Switch>
          {routes.map(Component => (
            <Route
              key={Component.id}
              path={`/${Component.id}`}
              exact
              render={props => <Component {...parse(props.location.search)} />}
            />
          ))}
          <Route
            render={({ location }) => {
              log(`"%s" (%O) not found- redirecting to ${fallback}`, location.pathname, location)
              return <Redirect to={fallback} />
            }}
          />
        </Switch>
      </ReactRouter>
    )
  }
}
