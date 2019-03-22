// tslint:disable:max-line-length
import { Gql } from '@ag/util'
import debug from 'debug'
import { Formik, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppMutation } from '../components'
import { CoreContext, typedFields } from '../context'
import * as T from '../graphql-types'
import { HomePage } from '../pages'

const log = debug('core:LoginForm')

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

interface Props {
  query: T.LoginForm.Query
}

export class LoginForm extends React.PureComponent<Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

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
  }

  formApi = React.createRef<Formik>()

  render() {
    const { ui, intl } = this.context
    const { Text, DeleteButton } = ui
    const { Form, TextField } = typedFields<Values>(ui)
    const { dbs } = this.props.query
    const dbId = dbs && dbs.length ? dbs[0].dbId : undefined
    const create = !dbId

    return (
      <ApolloConsumer>
        {client => (
          <AppMutation<T.OpenDb.Mutation | T.CreateDb.Mutation, any>
            mutation={create ? LoginForm.mutations.createDb : LoginForm.mutations.openDb}
            refetchQueries={[
              { query: LoginForm.queries.LoginForm }, //
              { query: HomePage.queries.HomePage },
            ]}
            onCompleted={() => {
              client.reFetchObservableQueries()
            }}
          >
            {runMutation => {
              return (
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
                      const { dispatch } = this.context
                      await runMutation({ variables: { ...values, dbId } })
                      log('logged in')
                      dispatch(actions.closeDlg('login'))
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
              )
            }}
          </AppMutation>
        )}
      </ApolloConsumer>
    )
  }

  submit = () => {
    if (this.formApi.current) {
      this.formApi.current.submitForm()
    }
  }
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
