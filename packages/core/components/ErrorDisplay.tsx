import React, { useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { IntlContext, UiContext, useIntl, useUi } from '../context'

interface Props {
  error: undefined | Error | Error[] | ReadonlyArray<Error>
}

const show = (alert: UiContext['alert'], intl: IntlContext, errors: Props['error']) => {
  if (!errors) {
    return null
  }

  if (errors instanceof Error) {
    errors = [errors]
  }

  alert({
    title: intl.formatMessage(messages.error),
    body: (errors as Error[]).flatMap(e => [e.message, e.stack || '']).join('\n'),
    confirmText: intl.formatMessage(messages.ok),
    error: true,
  })
}

export const ErrorDisplay = Object.assign(
  React.memo<Props>(function _ErrorDisplay({ error }) {
    const intl = useIntl()
    const { alert } = useUi()
    useEffect(() => {
      show(alert, intl, error)
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
