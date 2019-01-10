import { Formik, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { actions } from '../actions'
import { AppContext, typedFields } from '../context'
import { LoginPageForm } from '../forms'
import { LoginPageQuery } from '../graphql-types'
import { AppState, selectors } from '../reducers'

type FormValues = LoginPageForm.Values

interface StateProps {
  data: LoginPageQuery
  dbId: string
}

interface DispatchProps {
  submitForm: (variables: FormValues) => any
  deleteDb: (opts: { dbId: string }) => any
}

interface Props extends StateProps, DispatchProps {}

export class LoginPageComponent extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static url = '/login'

  static readonly query = gql`
    query LoginPage {
      allDbs {
        dbId
        name
      }
    }
  `

  render() {
    const { submitForm, dbId } = this.props
    const { ui, intl } = this.context
    const { Page, Text, SubmitButton, DeleteButton } = ui
    const { Form, TextField } = typedFields<FormValues>(ui)
    const create = !dbId

    const initialValues = {
      ...LoginPageForm.initalValues,
      dbId,
    }

    return (
      <Page>
        <Formik initialValues={initialValues} validate={this.validate} onSubmit={submitForm}>
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
    const create = !values.dbId
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
    const { deleteDb, dbId } = this.props
    deleteDb({ dbId })
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

export const LoginPage = connect<StateProps, DispatchProps, {}, AppState>(
  state => ({
    data: selectors.getLoadData<LoginPageQuery>(state),
    dbId: LoginPageForm.getDbId(state),
  }),
  actions.loginPage
)(LoginPageComponent)
LoginPage.displayName = 'LoginPage'

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
