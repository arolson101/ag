// tslint:disable:max-line-length
import { BillsPage } from '@ag/core/pages'
import React from 'react'
import { MockApp, storiesOf } from './helpers'

storiesOf('Pages/BillsPage', module) //
  .add('empty', () => (
    <MockApp dataset='empty'>
      <BillsPage />
    </MockApp>
  ))
  .add('normal', () => (
    <MockApp dataset='normal'>
      <BillsPage />
    </MockApp>
  ))
  .add('full', () => (
    <MockApp dataset='full'>
      <BillsPage />
    </MockApp>
  ))
