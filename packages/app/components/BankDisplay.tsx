import gql from 'graphql-tag'
import React from 'react'
import { actions } from '../actions'
import { AppContext } from '../context'
import * as T from '../graphql-types'
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
        accounts {
          id
          name
        }
      }
    `,
  }

  render() {
    const { bank } = this.props
    const { ui } = this.context
    const { Card, Row, Text } = ui

    return (
      <Card key={bank.id}>
        <Row>
          <Row flex={1}>
            <Text header>{bank.name}</Text>
          </Row>
          <Row>
            <Link dispatch={actions.dlg.accountCreate({ bankId: bank.id })}>[add account]</Link>
            <Link dispatch={actions.dlg.bankEdit({ bankId: bank.id })}>[edit]</Link>
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
                  dispatch={actions.dlg.accountEdit({
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
