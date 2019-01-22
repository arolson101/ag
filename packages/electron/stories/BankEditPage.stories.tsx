// tslint:disable:no-implicit-dependencies
import { BankEditPage } from '@ag/app/pages'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  appDb: {
    bank: null,
    __typename: 'AppDb',
  },
}

storiesOf('BankEditPage', module) //
  .add('create', () => (
    <MockApp
      query={BankEditPage.queries.BankEditPage}
      variables={{ bankId: undefined }}
      response={emptyResponse}
    >
      <BankEditPage />
    </MockApp>
  ))
