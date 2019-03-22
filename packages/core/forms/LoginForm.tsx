// tslint:disable:max-line-length
import { Gql, MutationFn, useApolloClient, useMutation } from '@ag/util'
import debug from 'debug'
import { Formik, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React, { useContext, useImperativeHandle, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { CoreContext, typedFields } from '../context'
import * as T from '../graphql-types'

const log = debug('core:LoginForm')

interface FormValues {
  name: string
  password: string
  passwordConfirm?: string
}

const initialValues: FormValues = {
  name: 'appdb',
  password: '',
  passwordConfirm: '',
}

interface Props {
  query: T.LoginForm.Query
}

const queries = {
  LoginForm: gql`
    query LoginForm {
      dbs {
        dbId
        name
      }
    }
  ` as Gql<T.LoginForm.Query, T.LoginForm.Variables>,
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
}

export interface LoginForm {
  submit: () => any
}

interface ComponentProps extends Props {
  createDb: MutationFn<T.CreateDb.Mutation, T.CreateDb.Variables>
  openDb: MutationFn<T.OpenDb.Mutation, T.OpenDb.Variables>
}

const Component = Object.assign(
  React.forwardRef<LoginForm, ComponentProps>((props, ref) => {
    const { ui, intl, dispatch } = useContext(CoreContext)
    const { Text } = ui
    const { Form, TextField } = typedFields<FormValues>(ui)
    const { createDb, openDb, query } = props
    const dbId = query.dbs && query.dbs.length ? query.dbs[0].dbId : undefined
    const create = !dbId

    const formik = useRef<Formik<FormValues>>(null)

    useImperativeHandle(ref, () => ({
      submit: () => {
        formik.current!.submitForm()
      },
    }))

    return (
      <Formik
        ref={formik}
        validateOnBlur={false}
        initialValues={initialValues}
        validate={values => {
          const errors: FormikErrors<FormValues> = {}
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
            if (dbId) {
              await openDb({ variables: { ...values, dbId } })
            } else {
              await createDb({ variables: values })
            }
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
  }),
  {
    displayName: 'LoginForm.Component',
  }
)

export const LoginForm = Object.assign(
  React.forwardRef<LoginForm, Props>((props, ref) => {
    const client = useApolloClient()
    const component = useRef<LoginForm>(null)

    const createDb = useMutation(mutations.createDb, {
      update: () => {
        client.reFetchObservableQueries()
      },
    })

    const openDb = useMutation(mutations.openDb, {
      update: () => {
        client.reFetchObservableQueries()
      },
    })

    useImperativeHandle(ref, () => ({
      submit: () => {
        component.current!.submit()
      },
    }))

    return <Component ref={component} {...{ ...props, createDb, openDb }} />
  }),
  {
    id: 'LoginForm',
    displayName: 'LoginForm',
    Component,
    queries,
    mutations,
  }
)

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
