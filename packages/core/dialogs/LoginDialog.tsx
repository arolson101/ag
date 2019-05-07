import { useApolloClient, useQuery } from '@ag/util'
import React, { useCallback, useContext, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { CoreContext, useIntl, useUi } from '../context'
import { LoginForm } from '../forms'
import { deleteDb } from '../mutations'

interface Props {
  isOpen: boolean
}

export const LoginDialog = React.memo<Props>(props => {
  const { isOpen } = props
  const intl = useIntl()
  const ui = useUi()
  const { LoadingOverlay, Dialog } = ui
  const { data, loading, error } = useQuery(LoginForm.queries.LoginForm)
  const client = useApolloClient()
  const loginForm = useRef<LoginForm>(null)

  const open = useCallback(() => {
    if (loginForm.current) {
      loginForm.current.submit()
    }
  }, [loginForm.current])

  const dbId = data && data.dbs && data.dbs.length ? data.dbs[0].dbId : undefined

  return (
    <>
      <ErrorDisplay error={error} />

      <LoadingOverlay show={loading} title='LoginDialog' />
      {!loading && (
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
                  onClick: () => deleteDb({ ui, intl, dbId, client }),
                  isDanger: true,
                }
              : undefined
          }
        >
          <LoginForm ref={loginForm} query={data!} />
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
