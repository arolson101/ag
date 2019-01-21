import debug from 'debug'
import { Formik, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { defineMessages } from 'react-intl'
import { AppMutation, AppQuery, ConfirmButton, ErrorDisplay, Gql } from '../components'
import { AppContext, typedFields } from '../context'
import * as T from '../graphql-types'
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

const queries = {
  dbs: gql`
    query Dbs {
      dbs {
        dbId
        name
      }
    }
  ` as Gql<T.Dbs.Query, T.Dbs.Variables>,
}

const mutations = {
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
      <AppQuery query={queries.dbs}>
        {({ dbs }) => {
          const dbId = dbs.length ? dbs[0].dbId : undefined
          const create = !dbId

          const initialValues = {
            ...initalValues,
            dbId,
          }

          return (
            <Page>
              <AppMutation<T.OpenDb.Mutation | T.CreateDb.Mutation, any>
                mutation={create ? mutations.createDb : mutations.openDb}
                refetchQueries={[{ query: queries.dbs }]}
              >
                {runMutation => {
                  return (
                    <Formik
                      initialValues={initialValues}
                      validate={values => {
                        const errors: FormikErrors<Values> = {}
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
                      }}
                      onSubmit={async (values, factions) => {
                        try {
                          await runMutation({ variables: values })
                          const { dispatch } = this.context
                          dispatch(go.home())
                        } finally {
                          factions.setSubmitting(false)
                        }
                      }}
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

                          <SubmitButton
                            onPress={formApi.submitForm}
                            disabled={formApi.isSubmitting}
                          >
                            <Text>
                              {intl.formatMessage(create ? messages.create : messages.open)}
                            </Text>
                          </SubmitButton>
                          {dbId && (
                            <AppMutation
                              mutation={mutations.deleteDb}
                              variables={{ dbId }}
                              refetchQueries={[{ query: queries.dbs }]}
                              onCompleted={formApi.handleReset}
                            >
                              {deleteDb => (
                                <>
                                  <ConfirmButton
                                    message={intl.formatMessage(messages.deleteMessage)}
                                    component={DeleteButton}
                                    onConfirmed={deleteDb}
                                  >
                                    <Text>{intl.formatMessage(messages.delete)}</Text>
                                  </ConfirmButton>
                                </>
                              )}
                            </AppMutation>
                          )}
                        </Form>
                      )}
                    </Formik>
                  )
                }}
              </AppMutation>
            </Page>
          )
        }}
      </AppQuery>
    )
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
