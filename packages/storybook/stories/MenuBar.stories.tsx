// tslint:disable:max-line-length
import { MenuBar } from '@ag/core/components'
import React from 'react'
import { MockApp, storiesOf } from './helpers'

storiesOf('MenuBar', module) //
  .add('empty', () => (
    <MockApp dataset='empty'>
      <MenuBar />
    </MockApp>
  ))
  .add('normal', () => (
    <MockApp dataset='normal'>
      <MenuBar />
    </MockApp>
  ))
  .add('full', () => (
    <MockApp dataset='full'>
      <MenuBar />
    </MockApp>
  ))
