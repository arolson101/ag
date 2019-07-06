import React from 'react'
import { defineMessages } from 'react-intl'
import { SelectFieldItem, typedFields, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

interface Props {
  field: string
  label: string
}

export const AccountField = Object.assign(
  React.memo<Props>(function _AccountField({ field, label }) {
    const intl = useIntl()
    const { SelectField } = useUi()
    const accounts = useSelector(selectors.getAccounts)
    const getBank = useSelector(selectors.getBank)
    const items: SelectFieldItem[] = accounts.map(acct => {
      const intlContext = { bank: getBank(acct.bankId)!.name, account: acct.name }
      return {
        label: intl.formatMessage(messages.format, intlContext),
        value: acct.id,
      }
    })

    return <SelectField field={field} label={label} items={items} />
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
