import React from 'react'
import { SelectFieldItem, typedFields, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

interface Props {
  field: string
  label: string
}

export const AccountField = Object.assign(
  React.memo<Props>(function _AccountField({ field, label }) {
    const { SelectField } = useUi()
    const accounts = useSelector(selectors.accounts)
    const items: SelectFieldItem[] = accounts.map(acct => ({ label: acct.name, value: acct.id }))

    return <SelectField field={field} label={label} items={items} />
  }),
  {
    displayName: 'AccountField',
  }
)
