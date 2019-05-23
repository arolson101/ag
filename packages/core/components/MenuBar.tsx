import { Gql, useQuery } from '@ag/util'
import debug from 'debug'
import gql from 'graphql-tag'
import React from 'react'
import { actions } from '../actions'
import { NavMenuItem, useAction, useUi } from '../context'
import * as T from '../graphql-types'
import { ErrorDisplay } from './ErrorDisplay'

const log = debug('core:MenuBar')

interface Props {}

const queries = {
  MenuBar: gql`
    query MenuBar {
      banks {
        id
        name
        icon
        accounts {
          id
          name
        }
      }
    }
  ` as Gql<T.MenuBar.Query, T.MenuBar.Variables>,
}

export const MenuBar = Object.assign(
  React.memo<Props>(function _MenuBar(props) {
    const bankCreate = useAction(actions.openDlg.bankCreate)
    const { NavMenu } = useUi()
    const { data, error } = useQuery(queries.MenuBar)

    return (
      <>
        <ErrorDisplay error={error} />
        <NavMenu
          items={[
            {
              key: 'accounts',
              title: 'accounts',
              subitems: [
                ...(data && data.banks
                  ? data.banks.map(
                      (bank): NavMenuItem => ({
                        key: bank.id,
                        title: bank.name,
                        image: bank.icon,
                        subitems: bank.accounts.map(
                          (account): NavMenuItem => ({
                            image: bank.icon,
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
                  onClick: bankCreate,
                } as NavMenuItem,
              ],
            } as NavMenuItem,
          ]}
        />
      </>
    )
  }),
  {
    id: 'MenuBar',
    displayName: 'MenuBar',
    queries,
  }
)
