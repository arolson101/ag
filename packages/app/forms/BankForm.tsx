import { Formik, FormikErrors, FormikProps } from 'formik'
import React from 'react'
import { defineMessages } from 'react-intl'
import { AppMutation, AppQuery, ConfirmButton, gql, Gql } from '../components'
import { AppContext, typedFields } from '../context'
import { filist, formatAddress } from '../data'
import { Bank } from '../entities'
import * as T from '../graphql-types'
import { HomePage } from '../pages'
import { pick } from '../util/pick'

export namespace BankForm {
  export interface Props {
    bankId?: string
    onClosed: () => any
  }
}

type BankInput = { [P in keyof Bank.Props]-?: Bank.Props[P] }

interface FormValues extends BankInput {
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

  private formApi: FormikProps<FormValues> | undefined

  render() {
    const { ui, intl } = this.context
    const { Text, Collapsible, DeleteButton } = ui
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
          return (
            <AppMutation
              mutation={BankForm.mutations.SaveBank}
              refetchQueries={[{ query: HomePage.queries.HomePage }]}
            >
              {saveBank => (
                <>
                  <Formik
                    validateOnBlur={false}
                    initialValues={initialValues} //
                    validate={values => {
                      const errors: FormikErrors<FormValues> = {}
                      if (!values.name.trim()) {
                        errors.name = intl.formatMessage(messages.valueEmpty)
                      }
                      return errors
                    }}
                    onSubmit={async ({ fi, ...input }, factions) => {
                      try {
                        await saveBank({ variables: { input, bankId } })
                      } finally {
                        factions.setSubmitting(false)
                        onClosed()
                      }
                    }}
                  >
                    {formApi => {
                      this.formApi = formApi
                      return (
                        <Form onSubmit={formApi.handleSubmit}>
                          {!bankId && (
                            <>
                              <Text>{intl.formatMessage(messages.fiHelp)}</Text>
                              <Divider />
                              <SelectField
                                field='fi'
                                items={filist.map(fi => ({ label: fi.name, value: fi.id }))}
                                label={intl.formatMessage(messages.fi)}
                                onValueChange={value => {
                                  if (formApi) {
                                    value = +value // coax to number
                                    const fi = filist[value]
                                    formApi.setFieldValue('name', value ? fi.name || '' : '')
                                    formApi.setFieldValue('web', fi.profile.siteURL || '')
                                    formApi.setFieldValue('favicon', '')
                                    formApi.setFieldValue('address', formatAddress(fi) || '')
                                    formApi.setFieldValue('fid', fi.fid || '')
                                    formApi.setFieldValue('org', fi.org || '')
                                    formApi.setFieldValue('ofx', fi.ofx || '')
                                  }
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
                            label={intl.formatMessage(messages.web)}
                          />
                          <TextField
                            field='notes'
                            label={intl.formatMessage(messages.notes)}
                            rows={4}
                          />
                          <Divider />
                          <CheckboxField
                            field='online'
                            label={intl.formatMessage(messages.online)}
                          />
                          <Collapsible show={formApi.values.online}>
                            <TextField
                              field='username'
                              noCorrect
                              label={intl.formatMessage(messages.username)}
                              placeholder={intl.formatMessage(messages.usernamePlaceholder)}
                            />
                            <TextField
                              secure
                              field='password'
                              label={intl.formatMessage(messages.password)}
                              placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                            />
                            <Divider />
                            <TextField
                              noCorrect
                              field='fid'
                              label={intl.formatMessage(messages.fid)}
                              placeholder={intl.formatMessage(messages.fidPlaceholder)}
                            />
                            <TextField
                              noCorrect
                              field='org'
                              label={intl.formatMessage(messages.org)}
                              placeholder={intl.formatMessage(messages.orgPlaceholder)}
                            />
                            <TextField
                              noCorrect
                              field='ofx'
                              label={intl.formatMessage(messages.ofx)}
                              placeholder={intl.formatMessage(messages.ofxPlaceholder)}
                            />
                          </Collapsible>
                        </Form>
                      )
                    }}
                  </Formik>

                  {bankId && (
                    <AppMutation
                      mutation={BankForm.mutations.DeleteBank}
                      variables={{ bankId }}
                      refetchQueries={[{ query: HomePage.queries.HomePage }]}
                      onCompleted={onClosed}
                    >
                      {deleteBank => (
                        <>
                          <ConfirmButton
                            message={intl.formatMessage(messages.confirmDeleteMessage)}
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
              )}
            </AppMutation>
          )
        }}
      </AppQuery>
    )
  }

  save = () => {
    if (this.formApi) {
      this.formApi.submitForm()
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
    defaultMessage: 'Online',
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
})
