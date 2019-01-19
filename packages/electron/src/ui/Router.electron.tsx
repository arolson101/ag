import { AppContext, RouterProps } from '@ag/app/context'
import { parse } from 'query-string'
import React from 'react'
import { Route, Router as ReactRouter, Switch } from 'react-router-dom'
import { history } from '../reducers'

export class ElectronRouter extends React.PureComponent<RouterProps> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { routes } = this.props
    const { ui } = this.context
    const { Text, SubmitButton } = ui

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
            render={({ location }) => (
              <>
                <Text>no matching route: {location.pathname}</Text>
                <SubmitButton
                  onPress={() => console.log('login')} //
                >
                  login
                </SubmitButton>
              </>
            )}
          />
        </Switch>
      </ReactRouter>
    )
  }
}
