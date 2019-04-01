import { Account } from '@ag/db'
import { CancelToken } from 'axios'
import { InjectedIntl } from 'react-intl'
import { getFinancialAccount, ofxService } from './ofxService'
import { Login, OfxServerInfo } from './ofxTypes'

interface GetTransactionsParams {
  serverInfo: OfxServerInfo
  login: Login
  account: Account
  start: Date
  end: Date
  cancelToken: CancelToken
  intl: InjectedIntl
}

export const getTransactions = async ({
  serverInfo,
  login,
  account,
  start,
  end,
  cancelToken,
  intl,
}: GetTransactionsParams) => {
  const service = ofxService({ serverInfo, cancelToken, intl })
  const bankAccount = getFinancialAccount({ service, login, account, intl })
  const bankStatement = await bankAccount.readStatement(start, end)
  const transactionList = bankStatement.getTransactionList()
  const transactions = transactionList.getTransactions()
  return transactions
}
