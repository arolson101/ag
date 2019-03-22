import { Gql, useQuery } from '@ag/util'
import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext } from 'react'
import { actions } from '../actions'
import { CoreContext, NavMenuItem } from '../context'
import * as T from '../graphql-types'

const log = debug('core:MenuBar')

interface Props {}

const queries = {
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

export const MenuBar = Object.assign(
  React.memo<Props>(props => {
    const { ui, dispatch } = useContext(CoreContext)
    const { NavMenu } = ui
    const { data } = useQuery(queries.MenuBar)

    const appDb = data && data.appDb

    return (
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
    )
  }),
  {
    id: 'MenuBar',
    displayName: 'MenuBar',
    queries,
  }
)
