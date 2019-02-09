import React from 'react'
import { defineMessages } from 'react-intl'
import { AppContext } from '../context'

interface Props {
  message: string
  onConfirmed: () => any
  component: React.ComponentType<{ onPress: (e: React.SyntheticEvent) => any }>
  danger?: boolean
}

interface State {
  show: boolean
  confirmed: boolean
}

export class ConfirmButton extends React.PureComponent<Props, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  state: State = {
    show: false,
    confirmed: false,
  }

  render() {
    const { message, danger, component: Component, children, ...props } = this.props

    const { intl, ui } = this.context
    const { Alert, DeleteButton } = ui

    return (
      <>
        <Component {...props} onPress={this.onPress}>
          {children}
        </Component>
        <Alert
          title={intl.formatMessage(messages.title)}
          body={[message]}
          confirmText={intl.formatMessage(messages.ok)}
          danger={danger}
          onConfirm={this.onConfirm}
          cancelText={intl.formatMessage(messages.cancel)}
          onCancel={this.onCancel}
          show={this.state.show}
        />
      </>
    )
  }

  onPress = () => {
    this.setState({ show: true })
  }

  onConfirm = () => {
    this.setState({ show: false, confirmed: true })
    this.props.onConfirmed()
  }

  onCancel = () => {
    this.setState({ show: false, confirmed: false })
  }
}

const messages = defineMessages({
  title: {
    id: 'ConfirmButton.title',
    defaultMessage: 'Are you sure?',
  },
  ok: {
    id: 'ConfirmButton.ok',
    defaultMessage: 'Ok',
  },
  cancel: {
    id: 'ConfirmButton.cancel',
    defaultMessage: 'Cancel',
  },
})
