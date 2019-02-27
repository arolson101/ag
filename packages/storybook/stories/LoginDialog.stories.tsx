import { LoginDialog, LoginForm } from '@ag/core'
import React from 'react'
import { MockApp, storiesOf } from './helpers'

const createMocks = [
  {
    request: { query: LoginForm.queries.LoginForm },
    result: {
      data: {
        dbs: [],
      },
    },
  },
]

const loginMocks = [
  {
    request: { query: LoginForm.queries.LoginForm },
    result: {
      data: {
        dbs: [
          {
            __typename: 'Db' as 'Db',
            dbId: 'oLhHJYViPrw=',
            name: 'appdb',
          },
        ],
      },
    },
  },
]

storiesOf('Forms/LoginForm', module)
  .add('create', () => (
    <MockApp>
      <LoginForm query={createMocks[0].result.data} />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp>
      <LoginForm query={loginMocks[0].result.data} />
    </MockApp>
  ))

storiesOf('Dialogs/LoginDialog', module)
  .add('create', () => (
    <MockApp mocks={createMocks}>
      <LoginDialog isOpen />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp mocks={loginMocks}>
      <LoginDialog isOpen />
    </MockApp>
  ))
