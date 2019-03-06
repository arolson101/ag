import { ApolloError } from 'apollo-client'
import React from 'react'
import { defineMessages } from 'react-intl'
import { AppContext } from '../context'

interface Props {
  error: undefined | Error | Error[] | ReadonlyArray<Error>
}

export class ErrorDisplay extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  componentDidMount() {
    this.showError()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.error !== prevProps.error) {
      this.showError()
    }
  }

  showError() {
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
    const { alert } = ui

    alert({
      title: intl.formatMessage(messages.error),
      body: (errors as Error[]).map(e => e.message).join('\n'),
      confirmText: intl.formatMessage(messages.ok),
      onConfirm: this.onConfirm,
    })
    this.setState({ show: true })
  }

  render() {
    return null
  }

  onConfirm = () => {}
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
