// tslint:disable:max-line-length
import debug from 'debug'
import { Formik, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { defineMessages } from 'react-intl'
import { AppMutation, ConfirmButton, Gql } from '../components'
import { AppContext, typedFields } from '../context'
import * as T from '../graphql-types'
import { HomePage } from '../pages'

const log = debug('app:LoginForm')
log.enabled = false // process.env.NODE_ENV !== 'production'

interface Values {
  name: string
  password: string
  passwordConfirm?: string
}

const initialValues: Values = {
  name: 'appdb',
  password: '',
  passwordConfirm: '',
}

export namespace LoginForm {
  export interface Props {
    query: T.LoginForm.Query
  }
}

export class LoginForm extends React.PureComponent<LoginForm.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = `LoginForm`

  static readonly queries = {
    LoginForm: gql`
      query LoginForm {
        dbs {
          dbId
          name
        }
      }
    ` as Gql<T.LoginForm.Query, T.LoginForm.Variables>,
  }

  static readonly mutations = {
    createDb: gql`
      mutation CreateDb($name: String!, $password: String!) {
        createDb(name: $name, password: $password)
      }
    ` as Gql<T.CreateDb.Mutation, T.CreateDb.Variables>,

    openDb: gql`
      mutation OpenDb($dbId: String!, $password: String!) {
        openDb(dbId: $dbId, password: $password)
      }
    ` as Gql<T.OpenDb.Mutation, T.OpenDb.Variables>,

    deleteDb: gql`
      mutation DeleteDb($dbId: String!) {
        deleteDb(dbId: $dbId)
      }
    ` as Gql<T.DeleteDb.Mutation, T.DeleteDb.Variables>,
  }

  formApi = React.createRef<Formik>()
  deleteDb = React.createRef<ConfirmButton>()

  render() {
    const { ui, intl } = this.context
    const { Text, DeleteButton } = ui
    const { Form, TextField } = typedFields<Values>(ui)
    const { dbs } = this.props.query
    const dbId = dbs && dbs.length ? dbs[0].dbId : undefined
    const create = !dbId

    return (
      <AppMutation<T.OpenDb.Mutation | T.CreateDb.Mutation, any>
        mutation={create ? LoginForm.mutations.createDb : LoginForm.mutations.openDb}
        refetchQueries={[
          { query: LoginForm.queries.LoginForm }, //
          { query: HomePage.queries.HomePage },
        ]}
      >
        {runMutation => {
          return (
            <>
              <Formik
                ref={this.formApi}
                validateOnBlur={false}
                initialValues={initialValues}
                validate={values => {
                  const errors: FormikErrors<Values> = {}
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
                }}
                onSubmit={async (values, factions) => {
                  try {
                    await runMutation({ variables: { ...values, dbId } })
                    log('logged in')
                  } finally {
                    factions.setSubmitting(false)
                  }
                }}
              >
                {formApi => (
                  <Form onSubmit={formApi.handleSubmit} lastFieldSubmit>
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
                      // onSubmitEditing={create ? this.focusConfirmInput :
                      // formApi.submitForm}
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
                  </Form>
                )}
              </Formik>

              {dbId && (
                <AppMutation
                  mutation={LoginForm.mutations.deleteDb}
                  variables={{ dbId }}
                  refetchQueries={[{ query: LoginForm.queries.LoginForm }]}
                >
                  {deleteDb => (
                    <>
                      <ConfirmButton
                        type='delete'
                        message={intl.formatMessage(messages.deleteMessage)}
                        component={DeleteButton}
                        onConfirmed={deleteDb}
                        ref={this.deleteDb}
                        danger
                      >
                        <Text>{intl.formatMessage(messages.delete)}</Text>
                      </ConfirmButton>
                    </>
                  )}
                </AppMutation>
              )}
            </>
          )
        }}
      </AppMutation>
    )
  }

  delete = () => {
    if (this.deleteDb.current) {
      this.deleteDb.current.onPress()
    }
  }

  submit = () => {
    if (this.formApi.current) {
      this.formApi.current.submitForm()
    }
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

const messages = defineMessages({
  welcomeMessageCreate: {
    id: 'LoginForm.welcomeMessageCreate',
    defaultMessage: 'Welcome!  Create a password to secure your data.',
  },
  welcomeMessageOpen: {
    id: 'LoginForm.welcomeMessageOpen',
    defaultMessage: 'Enter your password to access your data.',
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
  deleteMessage: {
    id: 'LoginForm.deleteMessage',
    defaultMessage: 'This will delete all the data.',
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
