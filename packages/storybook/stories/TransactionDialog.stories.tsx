// tslint:disable:max-line-length
import { TransactionDialog } from '@ag/core/dialogs'
import { TransactionForm } from '@ag/core/forms'
import React from 'react'
import { action, data, MockApp, storiesOf } from './helpers'

const formProps = {
  onClosed: action('onClosed'),
  loading: false,
  saveBank: action('saveBank') as any,
}

const dialogProps = {
  ...formProps,
  isOpen: true,
}

storiesOf('Dialogs/TransactionDialog', module)
  .add('create', () => (
    <MockApp dataset='normal'>
      <TransactionDialog {...dialogProps} accountId={data.normal.accountId} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp dataset='normal'>
      <TransactionDialog
        {...dialogProps}
        accountId={data.normal.accountId}
        transactionId={data.normal.transactionId}
      />
    </MockApp>
  ))

storiesOf('Forms/TransactionForm', module)
  .add('create', () => (
    <MockApp dataset='normal'>
      <TransactionForm
        {...formProps} //
        accountId={data.normal.accountId}
      />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp dataset='normal'>
      <TransactionForm
        {...formProps} //
        accountId={data.normal.accountId}
        transactionId={data.normal.transactionId}
      />
    </MockApp>
  ))
