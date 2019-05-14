// tslint:disable:no-implicit-dependencies
import { AccountDialog } from '@ag/core/dialogs'
import { AccountForm } from '@ag/core/forms'
import React from 'react'
import { action, data, MockApp, storiesOf } from './helpers'

storiesOf('Dialogs/AccountDialog', module)
  .add('create', () => (
    <MockApp dataset='normal'>
      <AccountDialog isOpen={true} bankId={data.normal.bankId} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp dataset='normal'>
      <AccountDialog isOpen={true} accountId={data.normal.accountId} />
    </MockApp>
  ))

storiesOf('Forms/AccountForm', module)
  .add('create', () => (
    <MockApp dataset='normal'>
      <AccountForm bankId={data.normal.bankId} onClosed={action('onClosed')} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp dataset='normal'>
      <AccountForm onClosed={action('onClosed')} accountId={data.normal.accountId} />
    </MockApp>
  ))
