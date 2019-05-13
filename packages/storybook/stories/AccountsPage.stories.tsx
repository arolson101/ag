// tslint:disable:max-line-length
import { AccountsPage } from '@ag/core/pages'
import React from 'react'
import { MockApp, storiesOf } from './helpers'

storiesOf('Pages/AccountsPage', module) //
  .add('empty', () => (
    <MockApp dataset='empty'>
      <AccountsPage />
    </MockApp>
  ))
  .add('normal', () => (
    <MockApp dataset='normal'>
      <AccountsPage />
    </MockApp>
  ))
  .add('full', () => (
    <MockApp dataset='full'>
      <AccountsPage />
    </MockApp>
  ))
