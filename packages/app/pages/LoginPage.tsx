import debug from 'debug'
import { Formik, FormikActions, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { ConfirmButton } from '../components/ConfirmButton'
import { AppContext, typedFields } from '../context'
import { LoginPageForm } from '../forms'
import * as Gql from '../graphql-types'

const log = debug('app:LoginPage')

type FormValues = LoginPageForm.Values

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

interface Props {}

export class LoginPage extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly route = `/login`
  static readonly link = () => `/login`

  render() {
    const { ui, intl } = this.context
    const { Page, Text, SubmitButton, DeleteButton, LoadingOverlay } = ui
    const { Form, TextField } = typedFields<FormValues>(ui)

    return (
      <LoginPageQuery>
        {result => {
          const { data, loading, error } = result
          if (loading) {
            return <LoadingOverlay show={loading} />
          } else if (error) {
            return <ErrorDisplay error={error} />
          }

          const dbId = data && data.allDbs.length ? data.allDbs[0].dbId : ''
          const create = !dbId

          const initialValues = {
            ...LoginPageForm.initalValues,
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
                    {!create && (
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

  onSubmit = async (values: FormValues, factions: FormikActions<FormValues>) => {
    try {
      const { client, ui, intl, router } = this.context
      const create = !values.dbId
      const refetchQueries = [{ query: LoginPageQuery.defaultProps.query }]
      if (create) {
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
      } else {
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
        log('CreateDb finished %O', res)
      }

      router.push('/home')
    } finally {
      factions.setSubmitting(false)
    }
  }

  // confirmDelete = (event: React.SyntheticEvent, dbId: string) => {
  //   const { ui, intl } = this.context
  //   ui.confirm({
  //     event,
  //     title: intl.formatMessage(messages.deleteMessage),
  //     action: intl.formatMessage(messages.delete),
  //     onConfirm: () => this.deleteDb(dbId),
  //   })
  // }

  // deleteDb = async (dbId: string) => {
  //   const mutation = gql`
  //     mutation DeleteDb($dbId: String!) {
  //       deleteDb(dbId: $dbId)
  //     }
  //   `
  //   const variables = { dbId }
  //   const { client, ui } = this.context
  //   const result = await client.mutate<Gql.DeleteDb.Mutation, Gql.DeleteDb.Variables>({
  //     mutation,
  //     variables,
  //   })
  // }

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
