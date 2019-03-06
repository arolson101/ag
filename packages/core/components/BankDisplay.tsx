import { ImageSource } from '@ag/util'
import gql from 'graphql-tag'
import React from 'react'
import { actions } from '../actions'
import { AppContext, ListItem } from '../context'
import * as T from '../graphql-types'
import { HomePage } from '../pages'
import { AppMutation } from './AppMutation'
import { Gql } from './Gql'
import { Link } from './Link'

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
    const { dispatch, ui } = this.context
    const { Card, Row, Column, Text, Image, List, Tile, PopoverButton } = ui
    const bankId = bank.id

    const size = 48

    return (
      <AppMutation
        mutation={BankDisplay.mutations.SyncAccounts}
        variables={{ bankId }}
        refetchQueries={[{ query: HomePage.queries.HomePage }]}
      >
        {syncAccounts => (
          <>
            <List
              key={bank.id}
              items={[
                {
                  title: bank.name,
                  image: bank.favicon,
                  // subtitle: bank.accounts.length === 0 ? 'add an account' : undefined,
                  actions: [
                    {
                      text: 'edit',
                      onClick: () => dispatch(actions.openDlg.bankEdit({ bankId })),
                    },
                    {
                      text: 'add account',
                      onClick: () => dispatch(actions.openDlg.accountCreate({ bankId })),
                    },
                    {
                      text: 'sync accounts',
                      onClick: syncAccounts,
                    },
                  ],
                },
                ...bank.accounts.map(
                  ({ name: title, id: accountId }): ListItem => ({
                    image: new ImageSource(),
                    // title: bank.name,
                    title,
                    subtitle: (
                      <Column>
                        <Text>$1000</Text>
                        <Text>latest transactions</Text>
                      </Column>
                    ),
                    actions: [
                      {
                        text: 'edit',
                        onClick: () => dispatch(actions.openDlg.accountEdit({ bankId, accountId })),
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
