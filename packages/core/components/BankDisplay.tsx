import gql from 'graphql-tag'
import React from 'react'
import { actions } from '../actions'
import { AppContext } from '../context'
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
    const { Card, Row, Column, Text, Image, List, ListItem, Tile, PopoverButton } = ui
    const bankId = bank.id

    const size = 48

    return (
      <List key={bank.id}>
        <AppMutation
          mutation={BankDisplay.mutations.SyncAccounts}
          variables={{ bankId }}
          refetchQueries={[{ query: HomePage.queries.HomePage }]}
        >
          {syncAccounts => (
            <ListItem
              title={bank.name}
              image={bank.favicon}
              actions={[
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
              ]}
            />
          )}
        </AppMutation>
        {!bank.accounts.length ? (
          <ListItem>
            <Text>No accounts</Text>
          </ListItem>
        ) : (
          bank.accounts.map(account => (
            <ListItem
              key={account.id}
              subtitle={account.name}
              actions={[
                {
                  text: 'edit',
                  onClick: () =>
                    dispatch(
                      actions.openDlg.accountEdit({
                        bankId: bank.id,
                        accountId: account.id,
                      })
                    ),
                },
              ]}
            />
          ))
        )}
      </List>
    )
  }
}
