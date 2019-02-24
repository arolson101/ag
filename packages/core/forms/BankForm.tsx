import { Bank } from '@ag/db'
import { pick } from '@ag/util'
import debug from 'debug'
import { Formik, FormikErrors } from 'formik'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Omit } from 'utility-types'
import { AppMutation, AppQuery, ConfirmButton, gql, Gql } from '../components'
import { AppContext, typedFields } from '../context'
import { filist, formatAddress } from '../data'
import * as T from '../graphql-types'
import { HomePage } from '../pages'

const log = debug('app:BankForm')

export namespace BankForm {
  export interface Props {
    bankId?: string
    onClosed: () => any
  }
}

type FormValues = typeof Bank.defaultValues & {
  fi: number
}

export class BankForm extends React.PureComponent<BankForm.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'BankForm'

  static readonly fragments = {
    bankFields: gql`
      fragment bankFields on Bank {
        name
        web
        address
        notes
        favicon

        online

        fid
        org
        ofx

        username
        password
      }
    `,
  }

  static readonly queries = {
    BankForm: gql`
      query BankForm($bankId: String) {
        appDb {
          bank(bankId: $bankId) {
            ...bankFields
          }
        }
      }
      ${BankForm.fragments.bankFields}
    ` as Gql<T.BankForm.Query, T.BankForm.Variables>,
  }

  static readonly mutations = {
    SaveBank: gql`
      mutation SaveBank($input: BankInput!, $bankId: String) {
        saveBank(input: $input, bankId: $bankId) {
          id
          ...bankFields
        }
      }
      ${BankForm.fragments.bankFields}
    ` as Gql<T.SaveBank.Mutation, T.SaveBank.Variables>,

    DeleteBank: gql`
      mutation DeleteBank($bankId: String!) {
        deleteBank(bankId: $bankId)
      }
    ` as Gql<T.DeleteBank.Mutation, T.DeleteBank.Variables>,
  }

  private formApi = React.createRef<Formik<FormValues>>()

  render() {
    const { ui, intl } = this.context
    const { Tabs, Tab, Text, DeleteButton, showToast } = ui
    const { Form, CheckboxField, Divider, SelectField, TextField, UrlField } = typedFields<
      FormValues
    >(ui)
    const { bankId, onClosed } = this.props

    return (
      <AppQuery query={BankForm.queries.BankForm} variables={{ bankId }}>
        {({ appDb }) => {
          if (!appDb) {
            throw new Error('db not open')
          }
          const { bank: edit } = appDb
          const defaultFi = edit ? filist.findIndex(fi => fi.name === edit.name) : 0
          const initialValues = {
            fi: defaultFi,
            ...(edit
              ? pick(edit, Object.keys(Bank.defaultValues) as Array<keyof Bank.Props>)
              : Bank.defaultValues),
          }
          // log('initial values: %o', initialValues)
          return (
            <AppMutation
              mutation={BankForm.mutations.SaveBank}
              refetchQueries={[
                { query: BankForm.queries.BankForm, variables: { bankId } },
                { query: HomePage.queries.HomePage },
              ]}
            >
              {saveBank => (
                <>
                  <Formik<FormValues>
                    ref={this.formApi}
                    validateOnBlur={false}
                    initialValues={initialValues}
                    validate={values => {
                      const errors: FormikErrors<FormValues> = {}
                      if (!values.name.trim()) {
                        errors.name = intl.formatMessage(messages.valueEmpty)
                      }
                      return errors
                    }}
                    onSubmit={async ({ fi, ...input }, factions) => {
                      try {
                        // log('onSubmit %o', { input, bankId })
                        await saveBank({ variables: { input, bankId } })
                        showToast(
                          intl.formatMessage(bankId ? messages.saved : messages.created, {
                            name: input.name,
                          })
                        )
                        onClosed()
                      } finally {
                        factions.setSubmitting(false)
                      }
                    }}
                  >
                    {formApi => {
                      return (
                        <Form onSubmit={formApi.handleSubmit}>
                          <Tabs id='BankForm'>
                            <Tab
                              id='location'
                              title={intl.formatMessage(messages.tabInfo)}
                              heading={intl.formatMessage(messages.tabInfo)}
                              panel={
                                <>
                                  {!bankId && (
                                    <>
                                      <Text>{intl.formatMessage(messages.fiHelp)}</Text>
                                      <Divider />
                                      <SelectField
                                        field='fi'
                                        items={filist.map(fi => ({ label: fi.name, value: fi.id }))}
                                        label={intl.formatMessage(messages.fi)}
                                        onValueChange={value => {
                                          value = +value // coax to number
                                          const fi = filist[value]
                                          formApi.setFieldValue('name', value ? fi.name || '' : '')
                                          formApi.setFieldValue('web', fi.profile.siteURL || '')
                                          formApi.setFieldValue('favicon', '')
                                          formApi.setFieldValue('address', formatAddress(fi) || '')
                                          formApi.setFieldValue('fid', fi.fid || '')
                                          formApi.setFieldValue('org', fi.org || '')
                                          formApi.setFieldValue('ofx', fi.ofx || '')
                                        }}
                                        searchable
                                      />
                                      <Divider />
                                    </>
                                  )}
                                  <TextField
                                    field='name'
                                    label={intl.formatMessage(messages.name)}
                                    placeholder={intl.formatMessage(messages.namePlaceholder)}
                                  />
                                  <TextField
                                    field='address'
                                    label={intl.formatMessage(messages.address)}
                                    rows={4}
                                  />
                                  <UrlField
                                    field='web'
                                    favicoField='favicon'
                                    favicoWidth={100}
                                    favicoHeight={100}
                                    label={intl.formatMessage(messages.web)}
                                  />
                                  <TextField
                                    field='notes'
                                    label={intl.formatMessage(messages.notes)}
                                    rows={4}
                                  />
                                  {bankId && (
                                    <AppMutation
                                      mutation={BankForm.mutations.DeleteBank}
                                      variables={{ bankId }}
                                      refetchQueries={[{ query: HomePage.queries.HomePage }]}
                                      onCompleted={() => {
                                        showToast(
                                          intl.formatMessage(messages.deleted, {
                                            name: edit!.name,
                                          }),
                                          true
                                        )
                                        onClosed()
                                      }}
                                    >
                                      {deleteBank => (
                                        <>
                                          <ConfirmButton
                                            type='delete'
                                            message={intl.formatMessage(
                                              messages.confirmDeleteMessage
                                            )}
                                            component={DeleteButton}
                                            onConfirmed={deleteBank}
                                            danger
                                          >
                                            <Text>{intl.formatMessage(messages.deleteBank)}</Text>
                                          </ConfirmButton>
                                        </>
                                      )}
                                    </AppMutation>
                                  )}
                                </>
                              }
                            />
                            <Tab
                              id='online'
                              title={intl.formatMessage(messages.tabOnline)}
                              heading={intl.formatMessage(messages.tabOnline)}
                              panel={
                                <>
                                  <CheckboxField
                                    field='online'
                                    label={intl.formatMessage(messages.online)}
                                  />
                                  <TextField
                                    field='username'
                                    noCorrect
                                    label={intl.formatMessage(messages.username)}
                                    placeholder={intl.formatMessage(messages.usernamePlaceholder)}
                                    disabled={!formApi.values.online}
                                  />
                                  <TextField
                                    secure
                                    field='password'
                                    label={intl.formatMessage(messages.password)}
                                    placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                                    disabled={!formApi.values.online}
                                  />
                                  <Divider />
                                  <TextField
                                    noCorrect
                                    field='fid'
                                    label={intl.formatMessage(messages.fid)}
                                    placeholder={intl.formatMessage(messages.fidPlaceholder)}
                                    disabled={!formApi.values.online}
                                  />
                                  <TextField
                                    noCorrect
                                    field='org'
                                    label={intl.formatMessage(messages.org)}
                                    placeholder={intl.formatMessage(messages.orgPlaceholder)}
                                    disabled={!formApi.values.online}
                                  />
                                  <TextField
                                    noCorrect
                                    field='ofx'
                                    label={intl.formatMessage(messages.ofx)}
                                    placeholder={intl.formatMessage(messages.ofxPlaceholder)}
                                    disabled={!formApi.values.online}
                                  />
                                </>
                              }
                            />
                          </Tabs>
                        </Form>
                      )
                    }}
                  </Formik>
                </>
              )}
            </AppMutation>
          )
        }}
      </AppQuery>
    )
  }

  save = () => {
    if (this.formApi.current) {
      this.formApi.current.submitForm()
    }
  }
}

const messages = defineMessages({
  save: {
    id: 'BankForm.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'BankForm.create',
    defaultMessage: 'Add',
  },
  tabInfo: {
    id: 'BankForm.tabInfo',
    defaultMessage: 'Information',
  },
  tabOnline: {
    id: 'BankForm.tabOnline',
    defaultMessage: 'Online',
  },
  tabResources: {
    id: 'BankForm.tabResources',
    defaultMessage: 'Resources',
  },
  tabAccounts: {
    id: 'BankForm.tabAccounts',
    defaultMessage: 'Accounts',
  },
  valueEmpty: {
    id: 'BankForm.valueEmpty',
    defaultMessage: 'Cannot be empty',
  },
  fi: {
    id: 'BankForm.fi',
    defaultMessage: 'Institution',
  },
  fiHelp: {
    id: 'BankForm.fiHelp',
    defaultMessage: 'Choose a financial institution from the list or fill in the details below',
  },
  fiPlaceholder: {
    id: 'BankForm.fiPlaceholder',
    defaultMessage: 'Select financial institution...',
  },
  name: {
    id: 'BankForm.name',
    defaultMessage: 'Name',
  },
  namePlaceholder: {
    id: 'BankForm.namePlaceholder',
    defaultMessage: 'Bank Name',
  },
  address: {
    id: 'BankForm.address',
    defaultMessage: 'Address',
  },
  web: {
    id: 'BankForm.web',
    defaultMessage: 'URL',
  },
  notes: {
    id: 'BankForm.notes',
    defaultMessage: 'Notes',
  },
  online: {
    id: 'BankForm.online',
    defaultMessage: 'Enabled',
  },
  fid: {
    id: 'BankForm.fid',
    defaultMessage: 'Fid',
  },
  fidPlaceholder: {
    id: 'BankForm.fidPlaceholder',
    defaultMessage: '1234',
  },
  org: {
    id: 'BankForm.org',
    defaultMessage: 'Org',
  },
  orgPlaceholder: {
    id: 'BankForm.orgPlaceholder',
    defaultMessage: 'MYBANK',
  },
  ofx: {
    id: 'BankForm.ofx',
    defaultMessage: 'OFX Server',
  },
  ofxPlaceholder: {
    id: 'BankForm.ofxPlaceholder',
    defaultMessage: 'https://ofx.mybank.com',
  },
  username: {
    id: 'BankForm.username',
    defaultMessage: 'Username',
  },
  usernamePlaceholder: {
    id: 'BankForm.usernamePlaceholder',
    defaultMessage: 'Username',
  },
  password: {
    id: 'BankForm.password',
    defaultMessage: 'Password',
  },
  passwordPlaceholder: {
    id: 'BankForm.passwordPlaceholder',
    defaultMessage: 'Required',
  },
  deleteBank: {
    id: 'BankForm.deleteBank',
    defaultMessage: 'Delete Bank',
  },
  confirmDeleteMessage: {
    id: 'BankForm.confirmDeleteMessage',
    defaultMessage: 'This will delete the bank, its accounts and transactions.',
  },
  saved: {
    id: 'BankForm.saved',
    defaultMessage: `'{name}' saved`,
  },
  created: {
    id: 'BankForm.created',
    defaultMessage: `'{name}' added`,
  },
  deleted: {
    id: 'BankForm.deleted',
    defaultMessage: `'{name}' deleted`,
  },
})
