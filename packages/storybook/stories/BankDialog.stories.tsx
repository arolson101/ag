// tslint:disable:max-line-length
import { BankDialog } from '@ag/core/dialogs'
import { BankForm } from '@ag/core/forms'
import { ImageSource } from '@ag/util'
import React from 'react'
import { action, addDelay, data, forever, MockApp, MockedResponse, storiesOf } from './helpers'

const formProps = {
  onClosed: action('onClosed'),
  loading: false,
  saveBank: action('saveBank') as any,
}

const dialogProps = {
  ...formProps,
  isOpen: true,
}

storiesOf('Dialogs/BankDialog', module)
  .add('create', () => (
    <MockApp dataset='empty'>
      <BankDialog {...dialogProps} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp dataset='normal'>
      <BankDialog {...dialogProps} bankId={data.bankId} />
    </MockApp>
  ))

storiesOf('Forms/BankForm', module)
  .add('create', () => (
    <MockApp dataset='empty'>
      <BankForm
        {...formProps} //
      />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp dataset='normal'>
      <BankForm
        {...formProps} //
        bankId={data.bankId}
      />
    </MockApp>
  ))
