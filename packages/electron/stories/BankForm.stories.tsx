// tslint:disable:no-implicit-dependencies
import { BankForm } from '@ag/app'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  appDb: {
    bank: null,
    __typename: 'AppDb',
  },
}

storiesOf('Forms/BankForm', module) //
  .add('create', () => (
    <MockApp
      query={BankForm.queries.BankForm}
      variables={{ bankId: undefined }}
      response={emptyResponse}
    >
      <BankForm onSaved={action('saved')} onDeleted={action('deleted')} />
    </MockApp>
  ))
