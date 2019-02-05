// tslint:disable:no-implicit-dependencies
import { LoginForm } from '@ag/app'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

storiesOf('Forms/LoginForm', module)
  .add('create', () => (
    <MockApp>
      <LoginForm
        query={{
          dbs: [
            {
              __typename: 'Db',
              dbId: 'oLhHJYViPrw=',
              name: 'appdb',
            },
          ],
        }}
      />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp>
      <LoginForm query={{ dbs: [] }} />
    </MockApp>
  ))
