import { Account } from '@ag/db'
import { pick } from '@ag/util'
import { Formik, FormikErrors, FormikProps } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { defineMessages } from 'react-intl'
import { AppMutation, AppQuery, Gql } from '../components'
import { CoreContext, typedFields } from '../context'
import * as T from '../graphql-types'
import { HomePage } from '../pages'

export namespace AccountForm {
  export interface Props {
    accountId?: string
    bankId?: string
    onClosed: () => any
  }
}

type FormValues = ReturnType<typeof Account.defaultValues>

const fragments = {
  accountFields: gql`
    fragment accountFields on Account {
      bankId
      name
      type
      color
      number
      visible
      routing
      key
      bank {
        name
      }
    }
  `,
}

const queries = {
  AccountForm: gql`
    query AccountForm($accountId: String, $bankId: String) {
      appDb {
        account(accountId: $accountId) {
          id
          ...accountFields
        }
        bank(bankId: $bankId) {
          name
        }
      }
    }
    ${fragments.accountFields}
  ` as Gql<T.AccountForm.Query, T.AccountForm.Variables>,
}

const mutations = {
  SaveAccount: gql`
    mutation SaveAccount($input: AccountInput!, $accountId: String, $bankId: String) {
      saveAccount(input: $input, accountId: $accountId, bankId: $bankId) {
        id
        ...accountFields
      }
    }
    ${fragments.accountFields}
  ` as Gql<T.SaveAccount.Mutation, T.SaveAccount.Variables>,
}

export class AccountForm extends React.PureComponent<AccountForm.Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  static readonly fragments = fragments
  static readonly queries = queries
  static readonly mutations = mutations

  private formApi: FormikProps<FormValues> | undefined

  render() {
    const { accountId, onClosed, bankId } = this.props
    const { intl, ui } = this.context
    const { showToast, Text } = ui
    const { Form, SelectField, TextField } = typedFields<FormValues>(ui)

    return (
      <AppQuery query={queries.AccountForm} variables={{ accountId, bankId }}>
        {({ appDb }) => {
          if (!appDb) {
            throw new Error('db not open')
          }

          const { account: edit, bank } = appDb
          const initialValues: FormValues = {
            ...(edit
              ? pick(edit, Object.keys(Account.defaultValues()) as Array<keyof Account.Props>)
              : Account.defaultValues()),
          }

          return (
            <AppMutation
              mutation={mutations.SaveAccount}
              refetchQueries={[
                { query: queries.AccountForm, variables: { accountId } },
                { query: HomePage.queries.HomePage },
              ]}
            >
              {saveAccount => (
                <Formik<FormValues>
                  validateOnBlur={false}
                  enableReinitialize
                  initialValues={initialValues}
                  validate={values => {
                    const errors: FormikErrors<FormValues> = {}
                    if (!values.name || !values.name.trim()) {
                      errors.name = intl.formatMessage(messages.valueEmpty)
                    }
                    return errors
                  }}
                  onSubmit={async ({ ...input }, factions) => {
                    try {
                      const variables = {
                        bankId,
                        accountId,
                        input,
                      }
                      await saveAccount({ variables } as any)
                      showToast(
                        intl.formatMessage(accountId ? messages.saved : messages.created, {
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
                    this.formApi = formApi
                    return (
                      <Form onSubmit={formApi.handleSubmit}>
                        <Text header>{edit ? edit.bank.name : bank ? bank.name : '<no bank>'}</Text>
                        <TextField
                          field='name'
                          label={intl.formatMessage(messages.name)}
                          placeholder={intl.formatMessage(messages.namePlaceholder)}
                          autoFocus={!edit}
                        />
                        <TextField
                          field='number'
                          label={intl.formatMessage(messages.number)}
                          placeholder={intl.formatMessage(messages.numberPlaceholder)}
                        />
                        <SelectField
                          field='type'
                          items={Object.keys(Account.Type).map(acct => ({
                            value: acct.toString(),
                            label: intl.formatMessage(
                              (Account.messages as Record<string, any>)[acct]
                            ),
                          }))}
                          label={intl.formatMessage(messages.type)}
                          onValueChange={type => {
                            formApi.setFieldValue(
                              'color',
                              Account.generateColor(type as Account.Type)
                            )
                          }}
                        />
                        <TextField
                          field='color'
                          label={intl.formatMessage(messages.color)}
                          placeholder={intl.formatMessage(messages.colorPlaceholder)}
                          color={formApi.values.color}
                        />
                        {(formApi.values.type === Account.Type.CHECKING ||
                          formApi.values.type === Account.Type.SAVINGS) && (
                          <TextField
                            field='routing'
                            label={intl.formatMessage(messages.routing)}
                            placeholder={intl.formatMessage(messages.routingPlaceholder)}
                          />
                        )}
                        {formApi.values.type === Account.Type.CREDITCARD && (
                          <TextField
                            field='key'
                            label={intl.formatMessage(messages.key)}
                            placeholder={intl.formatMessage(messages.keyPlaceholder)}
                          />
                        )}
                      </Form>
                    )
                  }}
                </Formik>
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
  createTitle: {
    id: 'AccountDialog.createTitle',
    defaultMessage: 'Add Account',
  },
  editTitle: {
    id: 'AccountDialog.editTitle',
    defaultMessage: 'Edit Account',
  },
  name: {
    id: 'AccountDialog.name',
    defaultMessage: 'Name',
  },
  namePlaceholder: {
    id: 'AccountDialog.namePlaceholder',
    defaultMessage: 'My Checking',
  },
  number: {
    id: 'AccountDialog.number',
    defaultMessage: 'Number',
  },
  numberPlaceholder: {
    id: 'AccountDialog.numberPlaceholder',
    defaultMessage: '54321',
  },
  type: {
    id: 'AccountDialog.type',
    defaultMessage: 'Type',
  },
  uniqueName: {
    id: 'AccountDialog.uniqueName',
    defaultMessage: 'This account name is already used',
  },
  uniqueNumber: {
    id: 'AccountDialog.uniqueNumber',
    defaultMessage: 'This account number is already used',
  },
  color: {
    id: 'AccountDialog.color',
    defaultMessage: 'Color',
  },
  colorPlaceholder: {
    id: 'AccountDialog.colorPlaceholder',
    defaultMessage: 'red',
  },
  routing: {
    id: 'AccountDialog.routing',
    defaultMessage: 'Routing Number',
    description: `Bank identifier, A-9
      Use of this field by country:
      COUNTRY     Interpretation
      BEL         Bank code
      CAN         Routing and transit number
      CHE         Clearing number
      DEU         Bankleitzahl
      ESP         Entidad
      FRA         Banque
      GBR         Sort code
      ITA         ABI
      NLD         Not used (field contents ignored)
      USA         Routing and transit number`,
  },
  routingPlaceholder: {
    id: 'AccountDialog.routingPlaceholder',
    defaultMessage: '0123456',
  },
  key: {
    id: 'AccountDialog.key',
    defaultMessage: 'Account Key',
  },
  keyPlaceholder: {
    id: 'AccountDialog.keyPlaceholder',
    defaultMessage: '(for international accounts)',
  },
  saved: {
    id: 'AccountForm.saved',
    defaultMessage: "Account '{name}' saved",
  },
  created: {
    id: 'AccountForm.created',
    defaultMessage: "Account '{name}' added",
  },
})
