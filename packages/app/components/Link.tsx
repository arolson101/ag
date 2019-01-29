import React from 'react'
import { AppAction } from '../actions'
import { AppContext } from '../context'

interface Props {
  dispatch: AppAction
}

export class Link extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { ui } = this.context
    const { Link: LinkUI } = ui
    return <LinkUI onClick={this.onClick}>{this.props.children}</LinkUI>
  }

  onClick = () => {
    const { dispatch } = this.context
    const { dispatch: to } = this.props
    dispatch(to)
  }
}
