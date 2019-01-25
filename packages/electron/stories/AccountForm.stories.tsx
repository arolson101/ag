// tslint:disable:no-implicit-dependencies
import { AccountForm } from '@ag/app'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  appDb: {
    account: null,
    __typename: 'AppDb',
  },
}

const editResponse = {
  appDb: {
    account: {
      id: 'cjrbhh3dw0000415s5awimr3f',
      bankId: 'cjrbfiy580000415s2ibuxm2c',
      name: 'Savings',
      type: 'SAVINGS',
      color: '#19ff75',
      number: '123456',
      visible: true,
      routing: '5551212',
      key: '',
      __typename: 'Account',
    },
    __typename: 'AppDb',
  },
}

storiesOf('Forms/AccountForm', module) //
  .add('create', () => (
    <MockApp
      query={AccountForm.queries.AccountForm}
      variables={{ accountId: undefined }}
      response={emptyResponse}
    >
      <AccountForm bankId='cjrbfiy580000415s2ibuxm2c' onClosed={action('onClosed')} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp
      query={AccountForm.queries.AccountForm}
      variables={{ accountId: 'cjrbhh3dw0000415s5awimr3f' }}
      response={editResponse}
    >
      <AccountForm
        onClosed={action('onClosed')}
        bankId={'cjrbfiy580000415s2ibuxm2c'}
        accountId={'cjrbhh3dw0000415s5awimr3f'}
      />
    </MockApp>
  ))
