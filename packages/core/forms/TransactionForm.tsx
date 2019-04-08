import { Transaction } from '@ag/db'
import { Gql, MutationFn, pick, useApolloClient, useMutation, useQuery } from '@ag/util'
import accounting from 'accounting'
import { Formik, FormikErrors, useFormik } from 'formik'
import gql from 'graphql-tag'
import React, { useContext, useImperativeHandle, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { CoreContext, typedFields } from '../context'
import * as T from '../graphql-types'

interface Props {
  accountId: string
  transactionId?: string
}

type FormValues = ReturnType<typeof Transaction.defaultValues>

const fragments = {
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

const queries = {
  Transaction: gql`
    query Transaction($transactionId: String) {
      appDb {
        transaction(transactionId: $transactionId) {
          ...transactionFields
        }
      }
    }
    ${fragments.transactionFields}
  ` as Gql<T.Transaction.Query, T.Transaction.Variables>,
}

const mutations = {
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
    ${fragments.transactionFields}
  ` as Gql<T.SaveTransaction.Mutation, T.SaveTransaction.Variables>,

  DeleteTransaction: gql`
    mutation DeleteTransaction($transactionId: String!) {
      deleteTransaction(transactionId: $transactionId) {
        accountId
      }
    }
  ` as Gql<T.DeleteTransaction.Mutation, T.DeleteTransaction.Variables>,
}

export interface TransactionForm {
  save: () => any
}

interface ComponentProps extends Props {
  loading: boolean
  data: T.Transaction.Query | undefined
  saveTransaction: MutationFn<T.SaveTransaction.Mutation, T.SaveTransaction.Variables>
}

const Component = Object.assign(
  React.forwardRef<TransactionForm, ComponentProps>((props, ref) => {
    const { ui, intl } = useContext(CoreContext)
    const { showToast, Text } = ui
    const { Form, CurrencyField, DateField, TextField } = typedFields<FormValues>(ui)
    const { data, saveTransaction, loading, accountId, transactionId } = props

    const transaction = data && data.appDb && data.appDb.transaction
    const initialValues = transaction
      ? pick(transaction, Object.keys(Transaction.defaultValues()) as Array<
          keyof Transaction.Props
        >)
      : Transaction.defaultValues()

    const formik = useFormik<FormValues>({
      enableReinitialize: true,
      initialValues,
      validate: values => {
        const errors: FormikErrors<FormValues> = {}
        if (!values.name.trim()) {
          errors.name = intl.formatMessage(messages.valueEmpty)
        }
        return errors
      },
      onSubmit: input => {
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
      },
    })

    useImperativeHandle(ref, () => ({
      save: () => {
        formik.submitForm()
      },
    }))

    if (!loading && (!data || !data.appDb)) {
      throw new Error('db not open')
    }

    return (
      <Form onSubmit={formik.handleSubmit}>
        <DateField field='time' label={intl.formatMessage(messages.date)} />
        <TextField field='name' autoFocus label={intl.formatMessage(messages.name)} />
        <CurrencyField field='amount' label={intl.formatMessage(messages.amount)} />
        <TextField field='memo' label={intl.formatMessage(messages.memo)} />
      </Form>
    )
  }),
  {
    displayName: 'TransactionForm.Component',
  }
)

export const TransactionForm = Object.assign(
  React.forwardRef<TransactionForm, Props>((props, ref) => {
    const { transactionId, accountId } = props

    const component = useRef<TransactionForm>(null)
    const { data, loading, error } = useQuery(queries.Transaction, { variables: { transactionId } })
    const client = useApolloClient()
    const saveTransaction = useMutation(mutations.SaveTransaction, {
      update: () => {
        client.reFetchObservableQueries()
      },
    })
    useImperativeHandle(ref, () => ({
      save: () => {
        component.current!.save()
      },
    }))

    return (
      <>
        <ErrorDisplay error={error} />
        <Component ref={component} {...{ ...props, saveTransaction, data, loading }} />
      </>
    )
  }),
  {
    id: 'TransactionForm',
    displayName: 'TransactionForm',
    Component,
  }
)

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
