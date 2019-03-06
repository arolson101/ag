import { ImageSource } from '@ag/util'
import debug from 'debug'
import gql from 'graphql-tag'
import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext, ListItem } from '../context'
import * as T from '../graphql-types'
import { deleteAccount, deleteBank } from '../mutations'
import { HomePage } from '../pages'
import { AppMutation } from './AppMutation'
import { Gql } from './Gql'

const log = debug('core:BankDisplay')
log.enabled = true

export namespace BankDisplay {
  export interface Props {
    bank: T.BankDisplay.Fragment
  }
}

export class BankDisplay extends React.PureComponent<BankDisplay.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly fragments = {
    BankDisplay: gql`
      fragment BankDisplay on Bank {
        id
        name
        favicon
        accounts {
          id
          name
        }
      }
    `,
  }

  static readonly mutations = {
    SyncAccounts: gql`
      mutation SyncAccounts($bankId: String!) {
        syncAccounts(bankId: $bankId) {
          ...BankDisplay
        }
      }
      ${BankDisplay.fragments.BankDisplay}
    ` as Gql<T.SyncAccounts.Mutation, T.SyncAccounts.Variables>,
  }

  render() {
    const { bank } = this.props
    const { dispatch, ui, intl } = this.context
    const { Card, Row, Column, Text, Image, List, Tile, PopoverButton } = ui
    const bankId = bank.id

    const size = 48

    return (
      <AppMutation
        mutation={BankDisplay.mutations.SyncAccounts}
        variables={{ bankId }}
        refetchQueries={[{ query: HomePage.queries.HomePage }]}
      >
        {(syncAccounts, { client }) => (
          <>
            <List
              key={bank.id}
              items={[
                {
                  title: bank.name,
                  image: bank.favicon,
                  // subtitle: bank.accounts.length === 0 ? 'add an account' : undefined,
                  contextMenuHeader: bank.name,
                  actions: [
                    {
                      icon: 'edit',
                      text: intl.formatMessage(messages.editBank),
                      onClick: () => dispatch(actions.openDlg.bankEdit({ bankId })),
                    },
                    {
                      icon: 'trash',
                      text: intl.formatMessage(messages.deleteBank),
                      onClick: () => deleteBank({ context: this.context, bank, client }),
                    },
                    {
                      icon: 'add',
                      text: intl.formatMessage(messages.addAccount),
                      onClick: () => dispatch(actions.openDlg.accountCreate({ bankId })),
                    },
                    {
                      text: 'sync accounts',
                      icon: 'sync',
                      onClick: syncAccounts,
                    },
                  ],
                },
                ...bank.accounts.map<ListItem>(
                  (account): ListItem => ({
                    image: new ImageSource(),
                    // title: bank.name,
                    title: account.name,
                    subtitle: (
                      <Column>
                        <Text>$1000</Text>
                        <Text>latest transactions</Text>
                      </Column>
                    ),
                    contextMenuHeader: `${bank.name} - ${account.name}`,
                    actions: [
                      {
                        icon: 'edit',
                        text: intl.formatMessage(messages.editAccount),
                        onClick: () =>
                          dispatch(actions.openDlg.accountEdit({ accountId: account.id })),
                      },
                      {
                        icon: 'trash',
                        text: intl.formatMessage(messages.deleteAccount),
                        onClick: () => deleteAccount({ context: this.context, account, client }),
                      },
                    ],
                  })
                ),
              ]}
            />
          </>
        )}
      </AppMutation>
    )
  }
}

const messages = defineMessages({
  editBank: {
    id: 'BankDisplay.editBank',
    defaultMessage: 'Edit Bank',
  },
  deleteBank: {
    id: 'BankDisplay.deleteBank',
    defaultMessage: 'Delete Bank',
  },
  addAccount: {
    id: 'BankDisplay.addAccount',
    defaultMessage: 'Add Account',
  },
  editAccount: {
    id: 'BankDisplay.editAccount',
    defaultMessage: 'Edit Account',
  },
  deleteAccount: {
    id: 'BankDisplay.deleteAccount',
    defaultMessage: 'Delete Account',
  },
})
