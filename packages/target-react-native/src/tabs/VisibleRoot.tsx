import { Container, Content, Root, View } from '@ag/ui-nativebase'
import debug from 'debug'
import React from 'react'
import { Navigation } from 'react-native-navigation'

const log = debug('rn:VisibleRoot')

interface Props {
  componentId: string
}

interface State {
  visible: boolean
}

let latest: VisibleRoot | undefined

export class VisibleRoot extends React.PureComponent<Props, State> {
  state: State = {
    visible: false,
  }

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    if (latest !== this) {
      if (latest) {
        latest.setState({ visible: false })
      }
      latest = this
      this.setState({ visible: true })
    }
  }

  componentWillUnmount() {
    if (latest === this) {
      latest = undefined
    }
  }

  render() {
    if (this.state.visible) {
      return <Root>{this.props.children}</Root>
    } else {
      return <>{this.props.children}</>
    }
  }
}
