import React from 'react'
import { AppAction } from '../actions'
import { AppContext } from '../context'

interface Props {
  to: AppAction
}

export class Link extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { ui } = this.context
    const { Text } = ui
    return <Text onClick={this.onClick}>{this.props.children}</Text>
  }

  onClick = () => {
    const { dispatch } = this.context
    const { to } = this.props
    dispatch(to)
  }
}
