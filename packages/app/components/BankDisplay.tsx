import gql from 'graphql-tag'
import React from 'react'
import { actions } from '../actions'
import { AppContext, pickBestImageUri } from '../context'
import * as T from '../graphql-types'
import { FavicoProps } from '../online'
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

  render() {
    const { bank } = this.props
    const { ui } = this.context
    const { Card, Row, Column, Text, Image } = ui

    const favicon = bank.favicon ? (JSON.parse(bank.favicon) as FavicoProps) : undefined
    const size = 48
    const source = favicon ? favicon.source : []

    return (
      <Card key={bank.id}>
        <Row>
          <Row flex={1}>
            <Image size={size} source={source} margin={4} />
            <Text header flex={1}>
              {bank.name}
            </Text>
            <Link dispatch={actions.openDlg.accountCreate({ bankId: bank.id })}>[add account]</Link>
            <Link dispatch={actions.openDlg.bankEdit({ bankId: bank.id })}>[edit]</Link>
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
