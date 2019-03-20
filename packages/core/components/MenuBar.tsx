import debug from 'debug'
import gql from 'graphql-tag'
import React from 'react'
import { AppQuery, Gql, Link } from '.'
import { actions } from '../actions'
import { CoreContext, NavMenuItem } from '../context'
import * as T from '../graphql-types'

const log = debug('core:MenuBar')

export namespace MenuBar {
  export interface Props {}
}

export class MenuBar extends React.PureComponent<MenuBar.Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  static readonly id = 'MenuBar'

  static readonly queries = {
    MenuBar: gql`
      query MenuBar {
        appDb {
          banks {
            id
            name
            favicon
            accounts {
              id
              name
            }
          }
        }
      }
    ` as Gql<T.MenuBar.Query, T.MenuBar.Variables>,
  }

  render() {
    const { ui, dispatch } = this.context
    const { Page, Row, Text, NavMenu } = ui

    return (
      <Page>
        <AppQuery
          query={MenuBar.queries.MenuBar}
          onCompleted={({ appDb }) => {
            if (!appDb) {
              dispatch(actions.openDlg.login())
            }
          }}
        >
          {({ appDb }) => (
            <NavMenu
              items={[
                {
                  key: 'accounts',
                  title: 'accounts',
                  subitems: [
                    ...(appDb
                      ? appDb.banks.map(
                          (bank): NavMenuItem => ({
                            key: bank.id,
                            title: bank.name,
                            image: bank.favicon,
                            subitems: bank.accounts.map(
                              (account): NavMenuItem => ({
                                image: bank.favicon,
                                key: account.id,
                                title: account.name,
                                active: false,
                              })
                            ),
                          })
                        )
                      : []),
                    {
                      key: 'addbank',
                      title: 'add bank',
                      onClick: () => dispatch(actions.openDlg.bankCreate()),
                    } as NavMenuItem,
                  ],
                } as NavMenuItem,
              ]}
            />
          )}
        </AppQuery>
      </Page>
    )
  }
}
