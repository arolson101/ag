// tslint:disable:no-implicit-dependencies
import { HomePage } from '@ag/app'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  appDb: {
    banks: [],
    __typename: 'AppDb',
  },
}

const fullResponse = {
  appDb: {
    banks: [
      {
        id: 'cjrasfcx000003v5ub8qeh6lu',
        name: 'Bank X',
        accounts: [
          {
            id: 'cjrc8t0o200003v5rg5pnt4ef',
            name: 'xchecking',
            __typename: 'Account',
          },
          {
            id: 'cjrc8t7s200013v5rddbjgr18',
            name: 'xsavings',
            __typename: 'Account',
          },
        ],
        __typename: 'Bank',
      },
      {
        id: 'cjrcbo7u400003v5s9e14jc9p',
        name: 'Citi Cards',
        accounts: [
          {
            id: 'cjrcbojsl00013v5syblv0ho8',
            name: 'creditcard',
            __typename: 'Account',
          },
        ],
        __typename: 'Bank',
      },
    ],
    __typename: 'AppDb',
  },
}

storiesOf('Pages/HomePage', module) //
  .add('empty', () => (
    <MockApp query={HomePage.queries.HomePage} response={emptyResponse}>
      <HomePage />
    </MockApp>
  ))
  .add('full', () => (
    <MockApp query={HomePage.queries.HomePage} response={fullResponse}>
      <HomePage />
    </MockApp>
  ))
