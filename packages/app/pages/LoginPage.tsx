import { Formik, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React, { PureComponent } from 'react'
import { defineMessages } from 'react-intl'
import { AppContext, typedFields } from '../context'
import { LoginPageQuery, LoginPageVariables } from '../graphql-types'
// import { LoginForm } from '../components/LoginForm'
import { PageQuery } from '../routes'

interface FormValues {
  password: string
  passwordConfirm: string
}

interface Props {
  createDb: (opts: { name: string; password: string }) => any
  openDb: (opts: { dbId: string; password: string }) => any
  deleteDb: (opts: { dbId: string }) => any
}

export class LoginPage extends PureComponent<LoginPageQuery & Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static url: string
  static query: PageQuery<LoginPageVariables>

  static readonly propTypes = {}

  render() {
    const { ui, intl } = this.context
    const { Page, Text, SubmitButton, DeleteButton } = ui
    const { Form, TextField } = typedFields<FormValues>(ui)
    const create = this.props.allDbs.length === 0

    const initialValues = {
      password: '',
      passwordConfirm: '',
    }

    return (
      <Page>
        <Formik initialValues={initialValues} validate={this.validate} onSubmit={this.onSubmit}>
          {formApi => (
            <Form onSubmit={formApi.submitForm}>
              <Text>
                {intl.formatMessage(
                  create ? messages.welcomeMessageCreate : messages.welcomeMessageOpen
                )}
              </Text>
              <TextField
                autoFocus
                secure
                field='password'
                label={intl.formatMessage(messages.passwordLabel)}
                placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                // returnKeyType={create ? 'next' : 'go'}
                // onSubmitEditing={create ? this.focusConfirmInput : formApi.submitForm}
              />
              {create && (
                <TextField
                  secure
                  field='passwordConfirm'
                  label={intl.formatMessage(messages.passwordConfirmLabel)}
                  placeholder={intl.formatMessage(messages.passwordConfirmPlaceholder)}
                  // returnKeyType={'go'}
                  onSubmitEditing={formApi.submitForm}
                  // inputRef={this.inputRef}
                />
              )}
              <SubmitButton onPress={formApi.submitForm}>
                <Text>{intl.formatMessage(create ? messages.create : messages.open)}</Text>
              </SubmitButton>
              {!create && (
                <DeleteButton onPress={this.confirmDelete}>
                  <Text>{intl.formatMessage(messages.delete)}</Text>
                </DeleteButton>
              )}
            </Form>
          )}
        </Formik>
      </Page>
    )
  }

  validate = (values: FormValues): FormikErrors<FormValues> => {
    const create = this.props.allDbs.length === 0
    const errors: FormikErrors<FormValues> = {}
    const { intl } = this.context

    if (create) {
      if (!values.password.trim()) {
        errors.password = intl.formatMessage(messages.valueEmpty)
      }
      if (values.password !== values.passwordConfirm) {
        errors.passwordConfirm = intl.formatMessage(messages.passwordsMatch)
      }
    } else {
      if (!values.password.trim()) {
        errors.password = intl.formatMessage(messages.valueEmpty)
      }
    }

    return errors
  }

  onSubmit = ({ password }: FormValues) => {
    const create = this.props.allDbs.length === 0
    if (create) {
      const { createDb } = this.props
      createDb({ name: 'appdb', password })
    } else {
      const { openDb } = this.props
      const dbId = this.props.allDbs[0].dbId
      openDb({ password, dbId })
    }
  }

  confirmDelete = (event: React.SyntheticEvent) => {
    const { ui, intl } = this.context
    ui.confirm({
      event,
      title: intl.formatMessage(messages.deleteTitle),
      action: intl.formatMessage(messages.delete),
      onConfirm: this.deleteDb,
    })
  }

  deleteDb = () => {
    const { deleteDb } = this.props
    const dbId = this.props.allDbs[0].dbId
    const variables = { dbId }
    deleteDb(variables)
  }

  // inputRef = (ref: any) => {
  //   this.confirmInput = ref
  // }

  // focusConfirmInput = () => {
  //   if (this.confirmInput && this.confirmInput.focus) {
  //     this.confirmInput.focus()
  //   }
  // }
}

LoginPage.url = '/login'

LoginPage.query = gql`
  query LoginPage {
    allDbs {
      dbId
      name
    }
  }
`

const messages = defineMessages({
  welcomeMessageCreate: {
    id: 'LoginForm.welcomeMessageCreate',
    defaultMessage: 'Welcome!  Create a password to secure your data.',
  },
  welcomeMessageOpen: {
    id: 'LoginForm.welcomeMessageOpen',
    defaultMessage: 'Welcome!  Enter your password to access your data.',
  },
  create: {
    id: 'LoginForm.create',
    defaultMessage: 'Create',
  },
  open: {
    id: 'LoginForm.open',
    defaultMessage: 'Open',
  },
  delete: {
    id: 'LoginForm.delete',
    defaultMessage: 'Delete',
  },
  deleteTitle: {
    id: 'LoginForm.deleteTitle',
    defaultMessage: 'Are you sure?',
  },
  valueEmpty: {
    id: 'LoginForm.valueEmpty',
    defaultMessage: 'Cannot be empty',
  },
  dbExists: {
    id: 'LoginForm.dbExists',
    defaultMessage: 'Database already exists',
  },
  passwordsMatch: {
    id: 'LoginForm.passwordsMatch',
    defaultMessage: 'Passwords must match',
  },
  nameLabel: {
    id: 'LoginForm.nameLabel',
    defaultMessage: 'Database Name',
  },
  namePlaceholder: {
    id: 'LoginForm.namePlaceholder',
    defaultMessage: 'My Database',
  },
  passwordLabel: {
    id: 'LoginForm.passwordLabel',
    defaultMessage: 'Password',
  },
  passwordPlaceholder: {
    id: 'LoginForm.passwordPlaceholder',
    defaultMessage: 'Required',
  },
  passwordConfirmLabel: {
    id: 'LoginForm.passwordConfirmLabel',
    defaultMessage: 'Confirm Password',
  },
  passwordConfirmPlaceholder: {
    id: 'LoginForm.passwordConfirmPlaceholder',
    defaultMessage: 'Required',
  },
  advanced: {
    id: 'LoginForm.advanced',
    defaultMessage: 'Advanced',
  },
})
