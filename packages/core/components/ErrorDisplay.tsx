import { ApolloError } from 'apollo-client'
import React from 'react'
import { defineMessages } from 'react-intl'
import { CoreContext } from '../context'

interface Props {
  error: undefined | Error | Error[] | ReadonlyArray<Error>
}

export class ErrorDisplay extends React.PureComponent<Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  componentDidMount() {
    this.showError()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.error !== prevProps.error) {
      this.showError()
    }
  }

  showError() {
    const { error } = this.props
    ErrorDisplay.show(this.context, error)
  }

  static show(context: CoreContext, errors: Props['error']) {
    if (!errors) {
      return null
    }

    if (errors instanceof ApolloError) {
      errors = errors.graphQLErrors.length ? errors.graphQLErrors : [errors]
    } else if (errors instanceof Error) {
      errors = [errors]
    }

    const { intl, ui } = context
    const { alert } = ui

    alert({
      title: intl.formatMessage(messages.error),
      body: (errors as Error[]).map(e => e.message).join('\n'),
      confirmText: intl.formatMessage(messages.ok),
      onConfirm: () => undefined,
      error: true,
    })
  }

  render() {
    return null
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
