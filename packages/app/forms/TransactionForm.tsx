import accounting from 'accounting'
import { Formik, FormikErrors, FormikProps } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { defineMessages } from 'react-intl'
import { AppMutation, AppQuery, Gql } from '../components'
import { typedFields } from '../context'
import { Transaction } from '../entities'
import * as T from '../graphql-types'
import { pick } from '../util/pick'

export namespace TransactionForm {
  export interface Props {
    accountId: string
    transactionId?: string
    onClosed: () => any
  }
}

type FormValues = Required<Transaction.Props>

export class TransactionForm extends React.Component<TransactionForm.Props> {
  static readonly fragments = {
    transactionFields: gql`
      fragment transactionFields on Transaction {
        account
        serverid
        time
        type
        name
        memo
        amount
      }
    `,
  }

  static readonly queries = {
    Transaction: gql`
      query Transaction($transactionId: String) {
        appDb {
          transaction(transactionId: $transactionId) {
            ...transactionFields
          }
        }
      }
      ${TransactionForm.fragments.transactionFields}
    ` as Gql<T.Transaction.Query, T.Transaction.Variables>,
  }

  static readonly mutations = {
    SaveTransaction: gql`
      mutation SaveTransaction(
        $input: TransactionInput!
        $transactionId: String
        $accountId: String!
      ) {
        saveTransaction(input: $input, transactionId: $transactionId, accountId: $accountId) {
          ...transactionFields
        }
      }
      ${TransactionForm.fragments.transactionFields}
    ` as Gql<T.SaveTransaction.Mutation, T.SaveTransaction.Variables>,

    DeleteTransaction: gql`
      mutation DeleteTransaction($transactionId: String!) {
        deleteTransaction(transactionId: $transactionId) {
          accountId
        }
      }
    ` as Gql<T.DeleteTransaction.Mutation, T.DeleteTransaction.Variables>,
  }

  private formApi?: FormikProps<FormValues>

  render() {
    const { ui, intl } = this.context
    const { accountId, transactionId, onClosed } = this.props
    const { Form, CurrencyField, DateField, TextField } = typedFields<FormValues>(ui)

    return (
      <AppQuery query={TransactionForm.queries.Transaction} variables={{ transactionId }}>
        {({ appDb }) => {
          if (!appDb) {
            throw new Error('db not open')
          }
          const { transaction: edit } = appDb
          const initialValues = edit
            ? pick(edit, Object.keys(Transaction.defaultValues()) as Array<keyof Transaction.Props>)
            : Transaction.defaultValues()

          return (
            <AppMutation mutation={TransactionForm.mutations.SaveTransaction}>
              {saveTransaction => (
                <>
                  <Formik<FormValues>
                    initialValues={initialValues}
                    validate={values => {
                      const errors: FormikErrors<FormValues> = {}
                      if (!values.name.trim()) {
                        errors.name = intl.formatMessage(messages.valueEmpty)
                      }
                      return errors
                    }}
                    onSubmit={input => {
                      const { amount } = input
                      const variables = {
                        accountId,
                        transactionId,
                        input: {
                          ...input,
                          amount: accounting.unformat(amount.toString()),
                        },
                      }
                      saveTransaction({ variables })
                    }}
                  >
                    {formApi => {
                      this.formApi = formApi
                      return (
                        <Form onSubmit={formApi.handleSubmit}>
                          <DateField field='time' label={intl.formatMessage(messages.date)} />
                          <TextField
                            field='name'
                            autoFocus
                            label={intl.formatMessage(messages.name)}
                          />
                          <CurrencyField
                            field='amount'
                            label={intl.formatMessage(messages.amount)}
                          />
                          <TextField field='memo' label={intl.formatMessage(messages.memo)} />
                        </Form>
                      )
                    }}

                    {/* {edit && (
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Button transparent danger onPress={this.confirmDeleteTransaction}>
              <Text>{intl.formatMessage(messages.deleteTransaction)}</Text>
            </Button>
          </View>
        )} */}
                  </Formik>
                </>
              )}
            </AppMutation>
          )
        }}
      </AppQuery>
    )
  }

  getApi = (formApi: FormikProps<FormValues>) => {
    this.formApi = formApi
  }

  save = () => {
    if (this.formApi) {
      this.formApi.submitForm()
    }
  }

  // confirmDeleteTransaction = () => {
  //   confirm({
  //     title: messages.deleteTransactionTitle,
  //     action: messages.deleteTransaction,
  //     onConfirm: this.deleteTransaction,
  //   })
  // }

  // deleteTransaction = () => {
  //   const { deleteTransaction, transactionId } = this.props
  //   if (transactionId) {
  //     deleteTransaction({ transactionId }, { complete: this.onTransactionDeleted })
  //   }
  // }

  // onTransactionDeleted = () => {
  //   const { navBack, navPopToTop } = this.props
  //   navBack()
  //   navPopToTop()
  // }
}

const messages = defineMessages({
  save: {
    id: 'TransactionForm.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'TransactionForm.create',
    defaultMessage: 'Add',
  },
  valueEmpty: {
    id: 'TransactionForm.valueEmpty',
    defaultMessage: 'Cannot be empty',
  },
  fi: {
    id: 'TransactionForm.fi',
    defaultMessage: 'Institution',
  },
  fiHelp: {
    id: 'TransactionForm.fiHelp',
    defaultMessage: 'Choose a financial institution from the list or fill in the details below',
  },
  fiPlaceholder: {
    id: 'TransactionForm.fiPlaceholder',
    defaultMessage: 'Select financial institution...',
  },
  account: {
    id: 'TransactionForm.account',
    defaultMessage: 'account',
  },
  accountPlaceholder: {
    id: 'TransactionForm.namePlaceholder',
    defaultMessage: 'Transaction Name',
  },
  serverid: {
    id: 'TransactionForm.serverid',
    defaultMessage: 'serverid',
  },
  type: {
    id: 'TransactionForm.type',
    defaultMessage: 'type',
  },
  name: {
    id: 'TransactionForm.name',
    defaultMessage: 'name',
  },
  date: {
    id: 'TransactionForm.date',
    defaultMessage: 'date',
  },
  memo: {
    id: 'TransactionForm.memo',
    defaultMessage: 'memo',
  },
  fid: {
    id: 'TransactionForm.fid',
    defaultMessage: 'Fid',
  },
  fidPlaceholder: {
    id: 'TransactionForm.fidPlaceholder',
    defaultMessage: '1234',
  },
  org: {
    id: 'TransactionForm.org',
    defaultMessage: 'Org',
  },
  orgPlaceholder: {
    id: 'TransactionForm.orgPlaceholder',
    defaultMessage: 'MYBANK',
  },
  ofx: {
    id: 'TransactionForm.ofx',
    defaultMessage: 'OFX Server',
  },
  ofxPlaceholder: {
    id: 'TransactionForm.ofxPlaceholder',
    defaultMessage: 'https://ofx.mybank.com',
  },
  username: {
    id: 'TransactionForm.username',
    defaultMessage: 'Username',
  },
  usernamePlaceholder: {
    id: 'TransactionForm.usernamePlaceholder',
    defaultMessage: 'Username',
  },
  password: {
    id: 'TransactionForm.password',
    defaultMessage: 'Password',
  },
  passwordPlaceholder: {
    id: 'TransactionForm.passwordPlaceholder',
    defaultMessage: 'Required',
  },
  deleteTransaction: {
    id: 'TransactionForm.deleteTransaction',
    defaultMessage: 'Delete Transaction',
  },
  deleteTransactionTitle: {
    id: 'TransactionForm.deleteTransactionTitle',
    defaultMessage: 'Are you sure?',
  },
  amount: {
    id: 'TransactionForm.amount',
    defaultMessage: 'amount',
  },
})
