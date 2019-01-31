import React from 'react'
import { defineMessages } from 'react-intl'
import { AppQuery } from '../components'
import { AppContext } from '../context'
import { LoginForm } from '../forms'

export namespace LoginDialog {
  export interface Props {
    isOpen: boolean
  }
}

export class LoginDialog extends React.PureComponent<LoginDialog.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = `LoginDialog`

  loginForm = React.createRef<LoginForm>()

  render() {
    const { isOpen } = this.props
    const {
      intl,
      ui: { Dialog, DialogBody, DialogFooter },
    } = this.context

    return (
      <AppQuery query={LoginForm.queries.LoginForm}>
        {({ dbs }) => {
          const dbId = dbs.length ? dbs[0].dbId : undefined

          return (
            <Dialog
              isOpen={isOpen}
              title={intl.formatMessage(dbId ? messages.titleOpen : messages.titleCreate)}
            >
              <DialogBody>
                <LoginForm ref={this.loginForm} />
              </DialogBody>
              <DialogFooter
                primary={{
                  title: intl.formatMessage(dbId ? messages.open : messages.create),
                  onClick: this.open,
                }}
              />
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
  titleCreate: {
    id: 'LoginDialog.titleCreate',
    defaultMessage: 'Create',
  },
  titleOpen: {
    id: 'LoginDialog.titleOpen',
    defaultMessage: 'Open',
  },
  create: {
    id: 'LoginDialog.create',
    defaultMessage: 'Create',
  },
  open: {
    id: 'LoginDialog.open',
    defaultMessage: 'Open',
  },
})
