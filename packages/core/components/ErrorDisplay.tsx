import debug from 'debug'
import React, { useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { IntlContext, UiContext, useIntl, useUi } from '../context'

const log = debug('core:ErrorDisplay')

interface Props {
  error: undefined | Error
}

const show = (alert: UiContext['alert'], intl: IntlContext, error: Error) => {
  log('%o', error)

  alert({
    title: intl.formatMessage(messages.error),
    body: error.message,
    confirmText: intl.formatMessage(messages.ok),
    error: true,
  })
}

export const ErrorDisplay = Object.assign(
  React.memo<Props>(function _ErrorDisplay({ error }) {
    const intl = useIntl()
    const { alert } = useUi()
    useEffect(() => {
      if (error) {
        show(alert, intl, error)
      }
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
