// tslint:disable:no-implicit-dependencies
import { BankForm } from '@ag/app/forms'
import { BankCreatePage } from '@ag/app/pages'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  appDb: {
    bank: null,
    __typename: 'AppDb',
  },
}

storiesOf('BankCreatePage', module) //
  .add('empty', () => (
    <MockApp
      query={BankForm.queries.BankForm}
      variables={{ bankId: undefined }}
      response={emptyResponse}
    >
      <BankCreatePage />
    </MockApp>
  ))
