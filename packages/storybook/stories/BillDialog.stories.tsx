// tslint:disable:max-line-length
import { BillDialog } from '@ag/core/dialogs'
import { BillForm } from '@ag/core/forms'
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

storiesOf('Dialogs/BillDialog', module)
  .add('create', () => (
    <MockApp dataset='normal'>
      <BillDialog {...dialogProps} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp dataset='normal'>
      <BillDialog {...dialogProps} billId={data.normal.billId} />
    </MockApp>
  ))

storiesOf('Forms/BillForm', module)
  .add('create', () => (
    <MockApp dataset='normal'>
      <BillForm
        {...formProps} //
      />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp dataset='normal'>
      <BillForm
        {...formProps} //
        billId={data.normal.billId}
      />
    </MockApp>
  ))
