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

const editResponse = {
  appDb: {
    bank: {
      name: 'Aerospace FCU',
      web: 'https://www.aerofcu.org',
      address: '2310 E. El Segundo Blvd.\nEl Segundo,, CA 90245\nUSA',
      notes: '',
      favicon: '',
      online: true,
      fid: '1976',
      org: 'ORCC',
      ofx: 'https://www20.onlinebank.com/OROFX16Listener',
      username: '',
      password: '',
      __typename: 'Bank',
    },
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
      <BankForm onClosed={action('onClosed')} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp
      query={BankForm.queries.BankForm}
      variables={{ bankId: 'cjr9drbdp0001415uh38a4g9j' }}
      response={editResponse}
    >
      <BankForm onClosed={action('onClosed')} bankId={'cjr9drbdp0001415uh38a4g9j'} />
    </MockApp>
  ))
