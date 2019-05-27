import { useSubmitRef } from '@ag/util'
import debug from 'debug'
import React, { useCallback, useImperativeHandle, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { useSelector } from 'react-redux'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { Errors, typedFields, useAction, useIntl, useUi } from '../context'
import { selectors } from '../reducers'

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
  dbs: DbInfo[]
}

export interface LoginForm {
  submit: () => any
}

interface ComponentProps extends Props {
  appError?: Error
  createDb: (params: { name: string; password: string }) => any
  openDb: (params: { dbId: string; password: string }) => any
}

const Component = Object.assign(
  React.forwardRef<LoginForm, ComponentProps>(function _LoginFormComponent(props, ref) {
    const intl = useIntl()
    const ui = useUi()
    const submitRef = useSubmitRef()
    const { Text } = ui
    const { Form, TextField } = typedFields<FormValues>(ui)
    const { createDb, openDb, dbs, appError } = props
    const dbId = dbs.length ? dbs[0].dbId : undefined
    const create = !dbId

    const validate = useCallback(
      (values: FormValues) => {
        const errors: Errors<FormValues> = {}
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
      },
      [intl]
    )

    const submit = useCallback(
      async values => {
        if (dbId) {
          openDb({ ...values, dbId })
        } else {
          createDb(values)
        }
      },
      [dbId, openDb, createDb]
    )

    useImperativeHandle(ref, () => ({
      submit: () => {
        submitRef.current()
      },
    }))

    return (
      <>
        <ErrorDisplay error={appError} />
        <Form
          initialValues={initialValues} //
          validate={validate}
          submit={submit}
          submitRef={submitRef}
          lastFieldSubmit
        >
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
          />
          {create && (
            <TextField
              secure
              field='passwordConfirm'
              label={intl.formatMessage(messages.passwordConfirmLabel)}
              placeholder={intl.formatMessage(messages.passwordConfirmPlaceholder)}
            />
          )}
        </Form>
      </>
    )
  }),
  {
    displayName: 'LoginForm.Component',
  }
)

export const LoginForm = Object.assign(
  React.forwardRef<LoginForm, Props>((props, ref) => {
    const component = useRef<LoginForm>(null)

    const createDb = useAction(actions.dbCreate)
    const appError = useSelector(selectors.getAppError)
    const openDb = useAction(actions.dbOpen)

    useImperativeHandle(ref, () => ({
      submit: () => {
        component.current!.submit()
      },
    }))

    return <Component ref={component} {...{ ...props, appError, createDb, openDb }} />
  }),
  {
    id: 'LoginForm',
    displayName: 'LoginForm',
    Component,
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
