import { ApolloError } from 'apollo-client'
import React, { useContext, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { CoreContext } from '../context'

interface Props {
  error: undefined | Error | Error[] | ReadonlyArray<Error>
}

const show = (context: CoreContext, errors: Props['error']) => {
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

export const ErrorDisplay = Object.assign(
  React.memo<Props>(function _ErrorDisplay({ error }) {
    const context = useContext(CoreContext)
    useEffect(() => {
      show(context, error)
    }, [error])
    return null
  }),
  {
    displayName: 'ErrorDisplay',
    show,
  }
)

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
