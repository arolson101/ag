// tslint:disable:no-implicit-dependencies
import { AccountDialog, AccountForm } from '@ag/core'
import React from 'react'
import { action, MockApp, storiesOf } from './helpers'

const emptyMocks = [
  {
    request: {
      query: AccountForm.queries.AccountForm,
      variables: { accountId: undefined, bankId: 'cjrbfiy580000415s2ibuxm2c' },
    },
    result: {
      data: {
        appDb: {
          account: null,
          bank: {
            name: 'Citi Cards',
            __typename: 'Bank',
          },
          __typename: 'AppDb',
        },
      },
    },
  },
]

const editMocks = [
  {
    request: {
      query: AccountForm.queries.AccountForm,
      variables: { accountId: 'cjrbhh3dw0000415s5awimr3f', bankId: undefined },
    },
    result: {
      data: {
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
            bank: {
              name: 'Citi Cards',
              __typename: 'Bank',
            },
            __typename: 'Account',
          },
          bank: null,
          __typename: 'AppDb',
        },
      },
    },
  },
]

storiesOf('Dialogs/AccountDialog', module)
  .add('create', () => (
    <MockApp mocks={emptyMocks}>
      <AccountDialog isOpen={true} bankId='cjrbfiy580000415s2ibuxm2c' />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp mocks={editMocks}>
      <AccountDialog isOpen={true} accountId={'cjrbhh3dw0000415s5awimr3f'} />
    </MockApp>
  ))

storiesOf('Forms/AccountForm', module)
  .add('create', () => (
    <MockApp mocks={emptyMocks}>
      <AccountForm bankId='cjrbfiy580000415s2ibuxm2c' onClosed={action('onClosed')} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp mocks={editMocks}>
      <AccountForm onClosed={action('onClosed')} accountId={'cjrbhh3dw0000415s5awimr3f'} />
    </MockApp>
  ))
