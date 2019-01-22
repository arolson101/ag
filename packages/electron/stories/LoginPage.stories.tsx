// tslint:disable:no-implicit-dependencies
import { LoginForm } from '@ag/app/forms'
import { LoginPage } from '@ag/app/pages'
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

storiesOf('LoginPage', module)
  .add('create', () => (
    <MockApp query={LoginForm.queries.LoginForm} response={emptyResponse}>
      <LoginPage />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp query={LoginForm.queries.LoginForm} response={existsResponse}>
      <LoginPage />
    </MockApp>
  ))
