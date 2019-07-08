import React from 'react'
import { SelectFieldItem, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

interface Props<Values = any> {
  field: keyof Values & string
  label: string
  disabled?: boolean
}

export type AccountFieldProps<Values> = Props<Values>

export const AccountField = Object.assign(
  React.memo<Props>(function _AccountField({ field, label, disabled }) {
    const { SelectField } = useUi()
    const accounts = useSelector(selectors.accounts)
    const items: SelectFieldItem[] = accounts.map(acct => ({ label: acct.name, value: acct.id }))

    return <SelectField {...{ field, label, items, disabled }} />
  }),
  {
    displayName: 'AccountField',
  }
)
