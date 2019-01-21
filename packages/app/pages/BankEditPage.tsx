import { Formik, FormikErrors } from 'formik'
import React from 'react'
import { defineMessages } from 'react-intl'
import { AppMutation, AppQuery, gql, Gql } from '../components'
import { AppContext, typedFields } from '../context'
import { filist } from '../data'
import { Bank } from '../entities'
import * as T from '../graphql-types'
import { pick } from '../util/pick'

export namespace BankEditPage {
  export interface Props {
    bankId?: string
  }
}

type BankInput = { [P in keyof Bank.Props]-?: Bank.Props[P] }

interface FormValues extends BankInput {
  fi: number
}

const queries = {
  BankEditPage: gql`
    query BankEditPage($bankId: String) {
      appDb {
        bank(bankId: $bankId) {
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
      }
    }
  ` as Gql<T.BankEditPage.Query, T.BankEditPage.Variables>,
}

const mutations = {
  SaveBank: gql`
    mutation SaveBank($input: BankInput!, $bankId: String) {
      saveBank(input: $input, bankId: $bankId) {
        id
        name
      }
    }
  ` as Gql<T.SaveBank.Mutation, T.SaveBank.Variables>,
}

export class BankEditPage extends React.PureComponent<BankEditPage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'BankEditPage'

  render() {
    const { ui, intl } = this.context
    const { Page, Text, Collapsible } = ui
    const { Form, CheckboxField, Divider, SelectField, TextField, UrlField } = typedFields<
      FormValues
    >(ui)
    const { bankId } = this.props

    return (
      <AppQuery query={queries.BankEditPage} variables={{ bankId }}>
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
            <AppMutation mutation={mutations.SaveBank}>
              {saveBank => (
                <Formik
                  initialValues={initialValues} //
                  validate={values => {
                    const errors: FormikErrors<FormValues> = {}
                    if (!values.name.trim()) {
                      errors.name = intl.formatMessage(messages.valueEmpty)
                    }
                    return errors
                  }}
                  onSubmit={async (values, factions) => {
                    try {
                      await saveBank({ variables: { input: values, bankId } })
                    } finally {
                      factions.setSubmitting(false)
                    }
                  }}
                >
                  {formApi => (
                    <Form onSubmit={formApi.handleSubmit}>
                      <Divider>
                        <Text>{intl.formatMessage(messages.fiHelp)}</Text>
                      </Divider>
                      <SelectField
                        field='fi'
                        items={filist.map(fi => ({ label: fi.name, value: fi.id }))}
                        label={intl.formatMessage(messages.fi)}
                        // onValueChange={this.fiOnValueChange}
                        searchable
                      />
                      <Divider />
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
                      <CheckboxField field='online' label={intl.formatMessage(messages.online)} />
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
                  )}
                </Formik>
                /* {edit && (
                // <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                //   <Button transparent danger onPress={this.confirmDeleteBank}>
                //     <Text>{intl.formatMessage(messages.deleteBank)}</Text>
                //   </Button>
                // </View>
              )} */
              )}
            </AppMutation>
          )
        }}
      </AppQuery>
    )
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
  deleteBankTitle: {
    id: 'BankForm.deleteBankTitle',
    defaultMessage: 'Are you sure?',
  },
})
