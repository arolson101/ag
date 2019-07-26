import React, { useEffect } from 'react'
import { useAction } from '../context'
import { thunks } from '../thunks'

export const useAccountTransactions = (accountId: string) => {
  const dbLoadTransactions = useAction(thunks.dbLoadTransactions)

  useEffect(() => {
    dbLoadTransactions({ accountId })
  }, [dbLoadTransactions, accountId])
}
