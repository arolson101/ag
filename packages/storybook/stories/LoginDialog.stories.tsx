import { LoginDialog } from '@ag/core/dialogs'
import { LoginForm } from '@ag/core/forms'
import React from 'react'
import { MockApp, storiesOf } from './helpers'

const createData: DbInfo[] = []

const loginData: DbInfo[] = [
  {
    dbId: 'oLhHJYViPrw=',
    name: 'appdb',
  },
]

storiesOf('Forms/LoginForm', module)
  .add('create', () => (
    <MockApp>
      <LoginForm dbs={createData} />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp>
      <LoginForm dbs={loginData} />
    </MockApp>
  ))

storiesOf('Dialogs/LoginDialog', module)
  .add('create', () => (
    <MockApp>
      <LoginDialog isOpen />
    </MockApp>
  ))
  .add('login', () => (
    <MockApp>
      <LoginDialog isOpen />
    </MockApp>
  ))
