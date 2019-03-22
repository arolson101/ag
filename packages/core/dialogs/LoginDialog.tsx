import React from 'react'
import { defineMessages } from 'react-intl'
import { AppQuery } from '../components'
import { CoreContext } from '../context'
import { LoginForm } from '../forms'
import { deleteDb } from '../mutations'

interface Props {
  isOpen: boolean
}

export class LoginDialog extends React.PureComponent<Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  static readonly id = `LoginDialog`

  loginForm = React.createRef<LoginForm>()

  render() {
    const { isOpen } = this.props
    const {
      intl,
      ui: { Dialog },
    } = this.context

    return (
      <AppQuery query={LoginForm.queries.LoginForm}>
        {(query, client) => {
          const { dbs } = query
          const dbId = dbs && dbs.length ? dbs[0].dbId : undefined

          return (
            <Dialog
              isOpen={isOpen}
              title={intl.formatMessage(messages.title)}
              primary={{
                title: intl.formatMessage(dbId ? messages.open : messages.create),
                onClick: this.open,
              }}
              secondary={
                dbId
                  ? {
                      title: intl.formatMessage(messages.delete),
                      onClick: () => deleteDb({ context: this.context, dbId, client }),
                      isDanger: true,
                    }
                  : undefined
              }
            >
              <LoginForm ref={this.loginForm} query={query} />
            </Dialog>
          )
        }}
      </AppQuery>
    )
  }

  open = () => {
    if (this.loginForm.current) {
      this.loginForm.current.submit()
    }
  }
}

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
