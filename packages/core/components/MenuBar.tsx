import debug from 'debug'
import React from 'react'
import { actions } from '../actions'
import { NavMenuItem, useAction, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

const log = debug('core:MenuBar')

interface Props {}

export const MenuBar = Object.assign(
  React.memo<Props>(function _MenuBar(props) {
    const { NavMenu } = useUi()
    const bankCreate = useAction(actions.openDlg.bankCreate)
    const banks = useSelector(selectors.banks)
    const getImage = useSelector(selectors.getImage)
    const getAccountsForBank = useSelector(selectors.getAccountsForBank)

    return (
      <NavMenu
        items={[
          {
            key: 'accounts',
            title: 'accounts',
            subitems: [
              ...banks.map(
                (bank): NavMenuItem => ({
                  key: bank.id,
                  title: bank.name,
                  image: getImage(bank.iconId),
                  subitems: getAccountsForBank(bank.id).map(
                    (account): NavMenuItem => ({
                      image: getImage(bank.iconId),
                      key: account.id,
                      title: account.name,
                      active: false,
                    })
                  ),
                })
              ),
              {
                key: 'addbank',
                title: 'add bank',
                onClick: bankCreate,
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
  }
)
