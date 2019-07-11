import { Transaction } from '@ag/db'
import { pick, useSubmitRef } from '@ag/util'
import accounting from 'accounting'
import React, { useCallback, useImperativeHandle } from 'react'
import { defineMessages } from 'react-intl'
import { useFields } from '../components'
import { Errors, useAction, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

interface Props {
  accountId: string
  transactionId?: string
}

type FormValues = ReturnType<typeof Transaction.defaultValues>

export interface TransactionForm {
  save: () => any
}

export const TransactionForm = Object.assign(
  React.forwardRef<TransactionForm, Props>((props, ref) => {
    const intl = useIntl()
    const saveTransaction = useAction(thunks.saveTransaction)
    const submitFormRef = useSubmitRef()
    const getTransaction = useSelector(selectors.getTransaction)
    const { Form, CurrencyField, DateField, TextField } = useFields<FormValues>()
    const { accountId, transactionId } = props

    const transaction = getTransaction(transactionId)
    if (!transaction) {
      return null
    }

    const initialValues = transaction
      ? pick(transaction, Object.keys(Transaction.defaultValues()) as Array<
          keyof Transaction.Props
        >)
      : Transaction.defaultValues()

    const validate = useCallback(
      values => {
        const errors: Errors<FormValues> = {}
        if (!values.name.trim()) {
          errors.name = intl.formatMessage(messages.valueEmpty)
        }
        return errors
      },
      [intl]
    )

    const submit = useCallback(
      async input => {
        const { amount } = input
        await saveTransaction({
          accountId,
          transactionId,
          input: {
            ...input,
            amount: accounting.unformat(amount.toString()),
          },
        })
      },
      [accountId, transactionId, saveTransaction]
    )

    useImperativeHandle(ref, () => ({
      save: () => {
        submitFormRef.current()
      },
    }))

    return (
      <Form
        initialValues={initialValues}
        validate={validate}
        submit={submit}
        submitRef={submitFormRef}
      >
        <DateField field='time' label={intl.formatMessage(messages.date)} />
        <TextField field='name' autoFocus label={intl.formatMessage(messages.name)} />
        <CurrencyField field='amount' label={intl.formatMessage(messages.amount)} />
        <TextField field='memo' label={intl.formatMessage(messages.memo)} />
      </Form>
    )
  }),
  {
    id: 'TransactionForm',
    displayName: 'TransactionForm',
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
