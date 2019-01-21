import { AppContext, RouterProps } from '@ag/app'
import debug from 'debug'
import { parse } from 'query-string'
import React from 'react'
import { Redirect, Route, Router as ReactRouter, Switch } from 'react-router-dom'
import { history } from '../reducers'

const log = debug('electron:router')
log.enabled = process.env.NODE_ENV !== 'production'

export class ElectronRouter extends React.PureComponent<RouterProps> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { routes } = this.props

    return (
      <ReactRouter history={history}>
        <Switch>
          {Object.keys(routes).map(path => {
            const Component = routes[path] as React.ComponentType<any>
            return (
              <Route
                key={path}
                path={`/${path}`}
                exact
                render={props => <Component {...parse(props.location.search)} />}
              />
            )
          })}
          <Route
            render={({ location }) => {
              log('"%s" (%O) not found- redirecting to "/"', location.pathname, location)
              return <Redirect to='/' />
            }}
          />
        </Switch>
      </ReactRouter>
    )
  }
}
