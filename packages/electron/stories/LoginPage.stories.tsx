// tslint:disable:no-implicit-dependencies
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
    <MockApp query={LoginPage.queries.LoginPage} response={emptyResponse}>
      <LoginPage />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp query={LoginPage.queries.LoginPage} response={existsResponse}>
      <LoginPage />
    </MockApp>
  ))
