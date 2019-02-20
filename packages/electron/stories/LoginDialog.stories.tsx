// tslint:disable:no-implicit-dependencies
import { LoginDialog, LoginForm } from '@ag/app'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const createResponse = {
  data: {
    dbs: [],
  },
}

const loginResponse = {
  data: {
    dbs: [
      {
        __typename: 'Db',
        dbId: 'oLhHJYViPrw=',
        name: 'appdb',
      },
    ],
  },
}

storiesOf('Forms/LoginForm', module)
  .add('create', () => (
    <MockApp>
      <LoginForm query={createResponse.data} />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp>
      <LoginForm query={loginResponse.data as any} />
    </MockApp>
  ))

storiesOf('Dialogs/LoginDialog', module)
  .add('create', () => (
    <MockApp query={LoginForm.queries.LoginForm} response={createResponse}>
      <LoginDialog isOpen />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp query={LoginForm.queries.LoginForm} response={loginResponse}>
      <LoginDialog isOpen />
    </MockApp>
  ))
