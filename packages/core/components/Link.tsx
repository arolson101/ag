import React from 'react'
import { CoreAction } from '../actions'
import { CoreContext } from '../context'

interface Props {
  dispatch: CoreAction
}

export class Link extends React.PureComponent<Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

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
