// tslint:disable:max-line-length
import { HomePage } from '@ag/core/pages'
import React from 'react'
import { MockApp, storiesOf } from './helpers'

storiesOf('Pages/HomePage', module) //
  .add('empty', () => (
    <MockApp dataset='empty'>
      <HomePage />
    </MockApp>
  ))
  .add('normal', () => (
    <MockApp dataset='normal'>
      <HomePage />
    </MockApp>
  ))
  .add('full', () => (
    <MockApp dataset='full'>
      <HomePage />
    </MockApp>
  ))
