import React, { useCallback, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { useAction, useIntl, useSelector, useUi } from '../context'
import { LoginForm } from '../forms'
import { selectors } from '../reducers'

interface Props {
  isOpen: boolean
}

export const LoginDialog = React.memo<Props>(function _LoginDialog(props) {
  const { isOpen } = props
  const intl = useIntl()
  const ui = useUi()
  const { LoadingOverlay, Dialog } = ui
  const isDbInitializing = useSelector(selectors.isDbInitializing)
  const isDbInitialized = useSelector(selectors.isDbInitialized)
  const dbs = useSelector(selectors.getDbs)
  const indexError = useSelector(selectors.getIndexError)
  const loginForm = useRef<LoginForm>(null)
  const deleteDb = useAction(actions.deleteDb)

  const open = useCallback(() => {
    if (loginForm.current) {
      loginForm.current.submit()
    }
  }, [loginForm.current])

  const dbId = dbs.length ? dbs[0].dbId : undefined

  return (
    <>
      <ErrorDisplay error={indexError} />

      <LoadingOverlay show={isDbInitializing} title='LoginDialog' />
      {isDbInitialized && (
        <Dialog
          isOpen={isOpen}
          title={intl.formatMessage(messages.title)}
          primary={{
            title: intl.formatMessage(dbId ? messages.open : messages.create),
            onClick: open,
          }}
          secondary={
            dbId
              ? {
                  title: intl.formatMessage(messages.delete),
                  onClick: () => deleteDb({ dbId }),
                  isDanger: true,
                }
              : undefined
          }
        >
          <LoginForm ref={loginForm} dbs={dbs} />
        </Dialog>
      )}
    </>
  )
})

const messages = defineMessages({
  title: {
    id: 'LoginDialog.title',
    defaultMessage: 'Ag',
  },
  create: {
    id: 'LoginDialog.create',
    defaultMessage: 'Create',
  },
  open: {
    id: 'LoginDialog.open',
    defaultMessage: 'Open',
  },
  delete: {
    id: 'LoginDialog.delete',
    defaultMessage: 'Delete',
  },
})
