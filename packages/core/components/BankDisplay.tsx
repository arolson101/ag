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
    const { Card, Row, Column, Text, Image, Button, Tile, PopoverButton } = ui
    const bankId = bank.id

    const size = 48

    return (
      <Card key={bank.id}>
        <Row>
          <Row flex={1}>
            <Tile size={size} margin={5}>
              <Image size={size} src={bank.favicon} />
            </Tile>
            <Text header flex={1}>
              {bank.name}
            </Text>
            <Column>
              <AppMutation
                mutation={BankDisplay.mutations.SyncAccounts}
                variables={{ bankId }}
                refetchQueries={[{ query: HomePage.queries.HomePage }]}
              >
                {syncAccounts => (
                  <PopoverButton
                    minimal
                    content={[
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
                  >
                    <Text>...</Text>
                  </PopoverButton>
                )}
              </AppMutation>
            </Column>
          </Row>
        </Row>
        {!bank.accounts.length ? (
          <Text>No accounts</Text>
        ) : (
          bank.accounts.map(account => (
            <Row key={account.id}>
              <Row flex={1}>
                <Text muted>{account.name}</Text>
              </Row>
              <Row>
                <Link
                  dispatch={actions.openDlg.accountEdit({
                    bankId: bank.id,
                    accountId: account.id,
                  })}
                >
                  [edit]
                </Link>
              </Row>
            </Row>
          ))
        )}
      </Card>
    )
  }
}
