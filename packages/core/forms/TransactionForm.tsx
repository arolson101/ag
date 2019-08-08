import { Transaction } from '@ag/db'
import { pick, useSubmitRef } from '@ag/util'
import accounting from 'accounting'
import debug from 'debug'
import React, { useCallback, useImperativeHandle, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { useAccountTransactions, useFields } from '../components'
import { Errors, useAction, useIntl, useSelector } from '../context'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

const log = debug('core:TransactionForm')

interface Props {
  accountId: string
  transactionId?: string
  onClosed: () => any
}

type FormValues = ReturnType<typeof Transaction.defaultValues>

export interface TransactionForm {
  save: () => any
}

export const TransactionForm = Object.assign(
  React.forwardRef<TransactionForm, Props>(function _TransactionForm(props, ref) {
    const { accountId, transactionId, onClosed } = props
    const intl = useIntl()
    const saveTransactions = useAction(thunks.saveTransactions)
    const submitFormRef = useSubmitRef()
    const account = useSelector(selectors.getAccount)(accountId)
    const transaction = useSelector(selectors.getTransaction)(transactionId)
    const defaultCurrency = useSelector(selectors.currency)
    const { Form, CurrencyField, DateField, TextField } = useFields<FormValues>()

    useAccountTransactions(accountId)

    const initialValues = useMemo<FormValues>(
      () => ({
        ...Transaction.defaultValues(),
        ...(transaction ? pick(Transaction.keys, transaction) : {}),
      }),
      [transaction]
    )

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
        await saveTransactions({
          accountId,
          transactions: [
            {
              ...input,
              id: transactionId,
              amount: accounting.unformat(amount.toString()),
            },
          ],
        })
        onClosed()
      },
      [accountId, transactionId, saveTransactions]
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
        <TextField field='name' autoFocus label={intl.formatMessage(messages.name)} />
        <CurrencyField
          field='amount'
          label={intl.formatMessage(messages.amount)}
          currencyCode={account ? account.currencyCode : defaultCurrency}
        />
        <DateField field='time' label={intl.formatMessage(messages.date)} />
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
    defaultMessage: 'Payee',
  },
  date: {
    id: 'TransactionForm.date',
    defaultMessage: 'Date',
  },
  memo: {
    id: 'TransactionForm.memo',
    defaultMessage: 'Memo',
  },
  amount: {
    id: 'TransactionForm.amount',
    defaultMessage: 'Amount',
  },
})
