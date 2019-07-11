import React from 'react'
import { defineMessages } from 'react-intl'
import { SelectFieldItem, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

interface Props<Values = any> {
  field: keyof Values & string
  label: string
  disabled?: boolean
}

export type AccountFieldProps<Values> = Props<Values>

export const AccountField = Object.assign(
  React.memo<Props>(function _AccountField({ field, label, disabled }) {
    const intl = useIntl()
    const { SelectField } = useUi()
    const accounts = useSelector(selectors.accounts)
    const getBank = useSelector(selectors.getBank)
    const items: SelectFieldItem[] = accounts.map(acct => {
      const intlContext = { bank: getBank(acct.bankId)!.name, account: acct.name }
      return {
        label: intl.formatMessage(messages.format, intlContext),
        value: acct.id,
      }
    })

    return <SelectField {...{ field, label, items, disabled }} />
  }),
  {
    displayName: 'AccountField',
  }
)

const messages = defineMessages({
  format: {
    id: 'AccountField.format',
    defaultMessage: '{bank} - {account}',
  },
})
