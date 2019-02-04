import { ApolloError } from 'apollo-client'
import React from 'react'
import { defineMessages } from 'react-intl'
import { AppContext } from '../context'

interface Props {
  error: undefined | Error | Error[] | ReadonlyArray<Error>
}

interface State {
  show: boolean
}

export class ErrorDisplay extends React.PureComponent<Props, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  state: State = {
    show: true,
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.error !== prevProps.error) {
      this.setState({ show: true })
    }
  }

  render() {
    let { error: errors } = this.props

    if (!errors) {
      return null
    }

    if (errors instanceof ApolloError) {
      errors = errors.graphQLErrors.length ? errors.graphQLErrors : [errors]
    } else if (errors instanceof Error) {
      errors = [errors]
    }

    const { intl, ui } = this.context
    const { Alert } = ui

    return (
      <Alert
        title={intl.formatMessage(messages.error)}
        body={(errors as Error[]).map(e => e.message)}
        confirmText={intl.formatMessage(messages.ok)}
        onConfirm={this.onConfirm}
        show={this.state.show}
      />
    )
  }

  onConfirm = () => {
    this.setState({ show: false })
  }
}

const messages = defineMessages({
  empty: {
    id: 'ErrorDisplay.empty',
    defaultMessage: ' ',
  },
  error: {
    id: 'ErrorDisplay.error',
    defaultMessage: 'Error',
  },
  ok: {
    id: 'ErrorDisplay.ok',
    defaultMessage: 'Ok',
  },
})
