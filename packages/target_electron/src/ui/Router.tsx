import { AppContext, RouteContext, RouterProps } from '@ag/app/context'
import { parse, stringify } from 'query-string'
// import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { Route, Router as ReactRouter, Switch } from 'react-router-dom'
import { history } from '../store'

export const router: RouteContext = {
  push: (path: string, props: object | void) =>
    history.push(
      history.createHref({
        pathname: '/' + path,
        hash: '',
        search: props ? stringify(props) : '',
        state: {},
      })
    ),
  pop: () => history.goBack(),
  replace: (path: string, props: object | void) =>
    history.push(
      history.createHref({
        pathname: '/' + path,
        hash: '',
        search: props ? stringify(props) : '',
        state: {},
      })
    ),
  dialog: (path: string, props: object | void) => {
    throw new Error('not implemented')
  },
}

export class Router extends React.PureComponent<RouterProps> {
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
