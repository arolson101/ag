import React from 'react'
import { AppContext } from '../context'

export class ApolloClientContextProvider extends React.PureComponent {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static cachedContext: AppContext

  render() {
    ApolloClientContextProvider.cachedContext = this.context
    return <>{this.props.children}</>
  }
}
