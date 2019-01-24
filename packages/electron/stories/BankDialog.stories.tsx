// tslint:disable:no-implicit-dependencies
import { BankCreateDlg, BankForm } from '@ag/app'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  appDb: {
    bank: null,
    __typename: 'AppDb',
  },
}

storiesOf('Dialogs', module) //
  .add('BankCreateDlg', () => (
    <MockApp
      query={BankForm.queries.BankForm}
      variables={{ bankId: undefined }}
      response={emptyResponse}
    >
      <BankCreateDlg isOpen={true} />
    </MockApp>
  ))
