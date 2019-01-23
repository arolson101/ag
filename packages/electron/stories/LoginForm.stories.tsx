// tslint:disable:no-implicit-dependencies
import { LoginForm } from '@ag/app'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const existsResponse = {
  dbs: [
    {
      __typename: 'Db',
      dbId: 'oLhHJYViPrw=',
      name: 'appdb',
    },
  ],
}

const emptyResponse = {
  dbs: [],
}

storiesOf('Forms/LoginForm', module)
  .add('create', () => (
    <MockApp query={LoginForm.queries.LoginForm} response={emptyResponse}>
      <LoginForm />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp query={LoginForm.queries.LoginForm} response={existsResponse}>
      <LoginForm />
    </MockApp>
  ))
