// tslint:disable:max-line-length
import debug from 'debug'
import { Formik, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { defineMessages } from 'react-intl'
import { SvgUri } from '../../rn/src/ui/react-native-svg-uri'
import { AppMutation, AppQuery, ConfirmButton, Gql } from '../components'
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
      <SvgUri
        source={{
          uri: `data:image/svg+xml;utf-8,<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 21.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
width="45px" height="45px" viewBox="0 0 45 45" style="enable-background:new 0 0 45 45;" xml:space="preserve">
<style type="text/css">
.st0{fill:#FFFFFF;}
.st1{fill:#006FCF;}
</style>
<g>
<polygon id="logo-blue-box-small-45-9x45-a" class="st0" points="44.9,44.9 0,44.9 0,0 44.9,0 	"/>
</g>
<g transform="translate(0 .12)">
<path class="st1" d="M44.9,24.2V-0.1H0v44.9h44.9V31.7C44.8,31.7,44.9,24.2,44.9,24.2"/>
<path class="st0" d="M39.4,21.7h3.4v-7.9h-3.7v1.1l-0.7-1.1h-3.2v1.4l-0.6-1.4h-5.2c-0.2,0-0.5,0-0.7,0s-0.4,0.1-0.6,0.1s-0.3,0.1-0.5,0.2c-0.2,0.1-0.3,0.1-0.5,0.2v-0.2v-0.3H10.2l-0.5,1.3l-0.5-1.3h-4v1.4l-0.6-1.4H1.4L0,17.2v4.5h2.3l0.4-1.1h0.8l0.4,1.1h17.6v-1l0.7,1h4.9v-0.2v-0.4c0.1,0.1,0.3,0.1,0.4,0.2s0.3,0.1,0.4,0.2c0.2,0.1,0.4,0.1,0.6,0.1s0.5,0,0.7,0h2.9l0.4-1.1h0.8l0.4,1.1h4.9v-1L39.4,21.7z M44.9,31.7v-7.4H17.4l-0.7,1l-0.7-1H8v7.9h8l0.7-1l0.7,1h5v-1.7h-0.2c0.7,0,1.3-0.1,1.8-0.3v2.1h3.6v-1l0.7,1h14.9C43.8,32.1,44.4,32,44.9,31.7L44.9,31.7z"/>
<path class="st1" d="M43.2,29.8h-2.7v1.1h2.6c1.1,0,1.8-0.7,1.8-1.7s-0.6-1.5-1.6-1.5h-1.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h2.3l0.5-1.1h-2.7c-1.1,0-1.8,0.7-1.8,1.6c0,1,0.6,1.5,1.6,1.5h1.2c0.3,0,0.5,0.2,0.5,0.5C43.8,29.6,43.6,29.8,43.2,29.8L43.2,29.8z M38.3,29.8h-2.7v1.1h2.6c1.1,0,1.8-0.7,1.8-1.7s-0.6-1.5-1.6-1.5h-1.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h2.3l0.5-1.1h-2.7c-1.1,0-1.8,0.7-1.8,1.6c0,1,0.6,1.5,1.6,1.5h1.2c0.3,0,0.5,0.2,0.5,0.5C38.9,29.6,38.6,29.8,38.3,29.8L38.3,29.8z M34.8,26.6v-1.1h-4.2v5.3h4.2v-1.1h-3v-1.1h2.9v-1.1h-2.9v-1h3V26.6z M28,26.6c0.5,0,0.7,0.3,0.7,0.6c0,0.3-0.2,0.6-0.7,0.6h-1.5v-1.3L28,26.6L28,26.6z M26.5,28.9h0.6l1.6,1.9h1.5l-1.8-2c0.9-0.2,1.4-0.8,1.4-1.6c0-1-0.7-1.7-1.8-1.7h-2.8v5.3h1.2L26.5,28.9L26.5,28.9z M23.3,27.3c0,0.4-0.2,0.7-0.7,0.7H21v-1.4h1.5C23,26.6,23.3,26.9,23.3,27.3L23.3,27.3z M19.8,25.5v5.3H21V29h1.6c1.1,0,1.9-0.7,1.9-1.8c0-1-0.7-1.8-1.8-1.8L19.8,25.5L19.8,25.5z M18,30.8h1.5l-2.1-2.7l2.1-2.6H18l-1.3,1.7l-1.3-1.7h-1.5l2.1,2.6l-2.1,2.6h1.5l1.3-1.7L18,30.8z M13.5,26.6v-1.1H9.3v5.3h4.2v-1.1h-3v-1.1h2.9v-1.1h-2.9v-1h3V26.6z M37.8,17.2l2.1,3.2h1.5v-5.3h-1.2v3.5l-0.3-0.5l-1.9-3h-1.6v5.3h1.2v-3.6L37.8,17.2z M32.6,17.1L33,16l0.4,1.1l0.5,1.2h-1.8L32.6,17.1z M34.7,20.4H36l-2.3-5.3h-1.6l-2.3,5.3h1.3l0.5-1.1h2.6L34.7,20.4z M29.1,20.4L29.1,20.4l0.5-1.1h-0.3c-0.9,0-1.4-0.6-1.4-1.5v-0.1c0-0.9,0.5-1.5,1.4-1.5h1.3v-1.1h-1.4c-1.6,0-2.5,1.1-2.5,2.6v0.1C26.7,19.4,27.6,20.4,29.1,20.4L29.1,20.4z M24.6,20.4h1.2V18v-2.8h-1.2v2.7V20.4z M22,16.2c0.5,0,0.7,0.3,0.7,0.6c0,0.3-0.2,0.6-0.7,0.6h-1.5v-1.3L22,16.2L22,16.2z M20.5,18.5h0.6l1.6,1.9h1.5l-1.8-2c0.9-0.2,1.4-0.8,1.4-1.6c0-1-0.7-1.7-1.8-1.7h-2.8v5.3h1.2L20.5,18.5L20.5,18.5z M18.3,16.2v-1.1h-4.2v5.3h4.2v-1.1h-3v-1.1h2.9v-1.1h-2.9v-1h3V16.2z M9.2,20.4h1.1l1.5-4.3v4.3H13v-5.3h-2l-1.2,3.6l-1.2-3.6h-2v5.3h1.2v-4.3L9.2,20.4z M2.7,17.1L3.1,16l0.4,1.1L4,18.3H2.2L2.7,17.1z M4.8,20.4h1.3l-2.3-5.3H2.3L0,20.4h1.3l0.5-1.1h2.6L4.8,20.4z"/>
</g>
</svg>`,
        }}
      />
    )

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
                  <Form onSubmit={formApi.handleSubmit}>
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
