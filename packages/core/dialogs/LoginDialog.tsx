import React, { useCallback, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { useAction, useIntl, useSelector, useUi } from '../context'
import { LoginForm } from '../forms'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

interface Props {
  isOpen: boolean
}

export const LoginDialog = React.memo<Props>(function _LoginDialog(props) {
  const { isOpen } = props
  const intl = useIntl()
  const { LoadingOverlay, Dialog, showToast, alert } = useUi()
  const isDbInitializing = useSelector(selectors.isDbInitializing)
  const isDbInitialized = useSelector(selectors.isDbInitialized)
  const dbs = useSelector(selectors.getDbs)
  const dbId = dbs.length ? dbs[0].dbId : undefined
  const dbDelete = useAction(thunks.dbDelete)
  const indexError = useSelector(selectors.getIndexError)
  const loginForm = useRef<LoginForm>(null)

  const open = useCallback(() => {
    if (loginForm.current) {
      loginForm.current.submit()
    }
  }, [loginForm.current])

  const confirmDeleteDb = useCallback(() => {
    alert({
      title: intl.formatMessage(messages.dlgTitle),
      body: intl.formatMessage(messages.dlgBody),
      danger: true,

      confirmText: intl.formatMessage(messages.dlgDelete),
      onConfirm: async () => {
        await dbDelete({ dbId: dbId! })
        showToast(intl.formatMessage(messages.dlgDeleted), true)
      },

      cancelText: intl.formatMessage(messages.dlgCancel),
      onCancel: () => {},
    })
  }, [dbDelete, showToast, intl])

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
                  onClick: confirmDeleteDb,
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
  dlgTitle: {
    id: 'LoginDialog.dlgTitle',
    defaultMessage: 'Are you sure?',
  },
  dlgBody: {
    id: 'LoginDialog.dlgBody',
    defaultMessage: 'This will all your data.  This action cannot be undone.',
  },
  dlgDelete: {
    id: 'LoginDialog.dlgDelete',
    defaultMessage: 'Delete',
  },
  dlgCancel: {
    id: 'LoginDialog.dlgCancel',
    defaultMessage: 'Cancel',
  },
  dlgDeleted: {
    id: 'LoginDialog.dlgDeleted',
    defaultMessage: 'Data deleted',
  },
})
