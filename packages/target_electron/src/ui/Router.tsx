import { AppContext, RouterProps } from '@ag/app/context'
// import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { Route, Router as ReactRouter, Switch } from 'react-router-dom'
import { history } from '../store'

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
            const Component = routes[path]
            return (
              <Route
                key={path}
                path={path}
                exact
                render={props => <Component {...props.match.params} />}
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
