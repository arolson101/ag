// tslint:disable:no-implicit-dependencies
import { HomePage } from '@ag/app/pages'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  appDb: {
    banks: [],
    __typename: 'AppDb',
  },
}

storiesOf('HomePage', module) //
  .add('empty', () => (
    <MockApp query={HomePage.queries.HomePage} response={emptyResponse}>
      <HomePage />
    </MockApp>
  ))
