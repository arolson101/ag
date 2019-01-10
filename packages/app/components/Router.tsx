import React from 'react'
import { connect } from 'react-redux'
import { AppContext, RouteConfig } from '../context'
import { LoginPage } from '../pages'
import { RootState, selectors } from '../state'

export const routeConfig: RouteConfig = {
  '/login': LoginPage,
}

interface StateProps {
  url: string
}
interface DispatchProps {}

interface Props extends StateProps, DispatchProps {}

export class RouterComponent extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { RouteSelector } = this.context.ui
    const { url } = this.props
    return <RouteSelector url={url} routes={routeConfig} />
  }
}

export const Router = connect<StateProps, DispatchProps, {}, RootState>(
  state => ({
    url: selectors.getUrl(state) || '/nourl',
  }),
  {}
)(RouterComponent)
