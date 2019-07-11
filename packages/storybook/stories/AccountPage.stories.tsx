// tslint:disable:max-line-length
import { AccountPage } from '@ag/core/pages'
import React from 'react'
import { data, MockApp, storiesOf } from './helpers'

storiesOf('Pages/AccountPage', module) //
  .add('normal', () => (
    <MockApp dataset='normal'>
      <AccountPage accountId={data.normal.accountId} />
    </MockApp>
  ))
  .add('full', () => (
    <MockApp dataset='full'>
      <AccountPage accountId={data.full.accountId} />
    </MockApp>
  ))
