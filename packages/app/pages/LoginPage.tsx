import debug from 'debug'
import { Formik, FormikActions, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { ConfirmButton, ErrorDisplay } from '../components'
import { AppContext, typedFields } from '../context'
import * as Gql from '../graphql-types'
import { go } from '../routes'

const log = debug('app:LoginPage')

interface Values {
  name: string
  dbId?: string
  password: string
  passwordConfirm?: string
}

const initalValues: Values = {
  name: 'appdb',
  dbId: undefined,
  password: '',
  passwordConfirm: '',
}

class LoginPageQuery extends Query<Gql.LoginPage.Query, Gql.LoginPage.Variables> {
  static defaultProps = {
    query: gql`
      query LoginPage {
        allDbs {
          dbId
          name
        }
      }
    `,
  }
}

class DeleteDbMutation extends Mutation<Gql.DeleteDb.Mutation, Gql.DeleteDb.Variables> {
  static defaultProps = {
    mutation: gql`
      mutation DeleteDb($dbId: String!) {
        deleteDb(dbId: $dbId)
      }
    `,
    refetchQueries: [{ query: LoginPageQuery.defaultProps.query }],
  }
}

export namespace LoginPage {
  export type Props = void
}

export class LoginPage extends React.PureComponent<LoginPage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = `LoginPage`

  render() {
    const { ui, intl } = this.context
    const { Page, Text, SubmitButton, DeleteButton, LoadingOverlay } = ui
    const { Form, TextField } = typedFields<Values>(ui)

    return (
      <LoginPageQuery>
        {result => {
          const { data, loading, error } = result
          if (loading) {
            return <LoadingOverlay show={loading} />
          } else if (error) {
            return <ErrorDisplay error={error} />
          }

          const dbId = data && data.allDbs.length ? data.allDbs[0].dbId : undefined
          const create = !dbId

          const initialValues = {
            ...initalValues,
            dbId,
          }

          return (
            <Page>
              <Formik
                initialValues={initialValues}
                validate={this.validate}
                onSubmit={this.onSubmit}
              >
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
                    <SubmitButton onPress={formApi.submitForm} disabled={formApi.isSubmitting}>
                      <Text>{intl.formatMessage(create ? messages.create : messages.open)}</Text>
                    </SubmitButton>
                    {dbId && (
                      <DeleteDbMutation variables={{ dbId }}>
                        {(deleteDb, { error: deleteDbError, loading: running }) => (
                          <>
                            <LoadingOverlay show={running} />
                            <ErrorDisplay error={deleteDbError} />
                            <ConfirmButton
                              message={intl.formatMessage(messages.deleteMessage)}
                              component={DeleteButton}
                              onConfirmed={deleteDb}
                            >
                              <Text>{intl.formatMessage(messages.delete)}</Text>
                            </ConfirmButton>
                          </>
                        )}
                      </DeleteDbMutation>
                    )}
                  </Form>
                )}
              </Formik>
            </Page>
          )
        }}
      </LoginPageQuery>
    )
  }

  validate = (values: Values): FormikErrors<Values> => {
    const errors: FormikErrors<Values> = {}
    const { intl } = this.context

    if (values.dbId) {
      if (!values.password.trim()) {
        errors.password = intl.formatMessage(messages.valueEmpty)
      }
    } else {
      if (!values.password.trim()) {
        errors.password = intl.formatMessage(messages.valueEmpty)
      }
      if (values.password !== values.passwordConfirm) {
        errors.passwordConfirm = intl.formatMessage(messages.passwordsMatch)
      }
    }

    return errors
  }

  onSubmit = async (values: Values, factions: FormikActions<Values>) => {
    try {
      const { client, dispatch } = this.context
      const refetchQueries = [{ query: LoginPageQuery.defaultProps.query }]
      if (values.dbId) {
        log('running OpenDb mutation')
        const { dbId, password } = values
        const mutation = gql`
          mutation OpenDb($dbId: String!, $password: String!) {
            openDb(dbId: $dbId, password: $password)
          }
        `
        const res = await client.mutate<Gql.OpenDb.Mutation, Gql.OpenDb.Variables>({
          mutation,
          variables: { dbId, password },
          refetchQueries,
        })
        log('OpenDb finished %O', res)
      } else {
        log('running CreateDb mutation')
        const { name, password } = values
        const mutation = gql`
          mutation CreateDb($name: String!, $password: String!) {
            createDb(name: $name, password: $password)
          }
        `
        const res = await client.mutate<Gql.CreateDb.Mutation, Gql.CreateDb.Variables>({
          mutation,
          variables: { name, password },
          refetchQueries,
        })
        log('CreateDb finished %O', res)
      }

      dispatch(go.home())
    } finally {
      factions.setSubmitting(false)
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
  deleteMessage: {
    id: 'LoginForm.deleteMessage',
    defaultMessage: 'This will delete all the data.  Are you sure?',
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
