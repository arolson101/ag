import { AppContext, RouterProps } from '@ag/app/context'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

export class Router extends React.PureComponent<RouterProps> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { routes } = this.props
    const { ui } = this.context
    const { Text, SubmitButton } = ui

    return (
      <BrowserRouter>
        <Switch>
          {Object.keys(routes).map(path => (
            <Route key={path} path={path} exact component={routes[path]} />
          ))}
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
      </BrowserRouter>
    )
  }
}
