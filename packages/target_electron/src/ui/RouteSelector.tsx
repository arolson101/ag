import { AppContext, RouteSelectorProps } from '@ag/app/context'
import React from 'react'

export class RouteSelector extends React.PureComponent<RouteSelectorProps> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { routes, url } = this.props
    const { ui } = this.context
    const { Text } = ui
    const Component = routes[url]
    if (Component) {
      return <Component />
    } else {
      return <Text>no route found for url {url}</Text>
    }
  }
}
