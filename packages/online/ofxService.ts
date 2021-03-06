import { Account } from '@ag/db'
import assert from 'assert'
import Axios, { AxiosRequestConfig, CancelToken, Method } from 'axios'
import debug from 'debug'
import * as ofx4js from 'ofx4js'
import { defineMessages, InjectedIntl } from 'react-intl'
import { Login, OfxServerInfo } from './ofxTypes'

const log = debug('online:ofxService')

const ajaxHandler = (cancelToken: CancelToken): ofx4js.AjaxHandler => async (
  url,
  verb,
  headers,
  body,
  async
): Promise<string> => {
  const res = await Axios({
    url,
    method: verb.toLowerCase() as Method,
    headers,
    data: body,
    cancelToken,
  })
  if (res.status !== 200) {
    throw new Error(res.statusText)
  }
  const text = res.data
  assert(typeof body === 'string')
  log('ajaxHandler %s %s %o %o', url, verb, body, text)
  return text
}

interface OfxServiceParams {
  serverInfo: OfxServerInfo
  cancelToken: CancelToken
  intl: InjectedIntl
}

export const ofxService = ({
  serverInfo,
  cancelToken,
  intl,
}: OfxServiceParams): ofx4js.FinancialInstitutionImpl => {
  const DefaultApplicationContext = ofx4js.DefaultApplicationContext
  const OFXApplicationContextHolder = ofx4js.OFXApplicationContextHolder
  OFXApplicationContextHolder.setCurrentContext(new DefaultApplicationContext('QWIN', '2300'))

  const { fid, org, ofx, name } = serverInfo
  if (!fid) {
    throw new Error(intl.formatMessage(messages.noFid))
  }
  if (!org) {
    throw new Error(intl.formatMessage(messages.noOrg))
  }
  if (!ofx) {
    throw new Error(intl.formatMessage(messages.noOfx))
  }
  if (!name) {
    throw new Error(intl.formatMessage(messages.noName))
  }

  const fiData = new ofx4js.BaseFinancialInstitutionData()
  fiData.setFinancialInstitutionId(fid)
  fiData.setOrganization(org)
  fiData.setOFXURL(ofx)
  fiData.setName(name)

  const connection = new ofx4js.OFXV1Connection()
  connection.setAjax(ajaxHandler(cancelToken))

  // NOTE: making an OFX connection will fail security checks in browsers.  On Chrome you
  // can make it run with the "--disable-web-security" command-line option
  // e.g. (OSX): open /Applications/Google\ Chrome.app --args --disable-web-security
  const service = new ofx4js.FinancialInstitutionImpl(fiData, connection)
  return service
}

interface CheckLoginParams {
  login: Login
  intl: InjectedIntl
}

export const checkLogin = ({ login, intl }: CheckLoginParams): Login => {
  const { username, password } = login
  if (!username) {
    throw new Error(intl.formatMessage(messages.noUsername))
  }
  if (!password) {
    throw new Error(intl.formatMessage(messages.noPassword))
  }
  return { username, password }
}

export const toAccountType = (acctType: ofx4js.AccountType): Account.Type => {
  let str = ofx4js.AccountType[acctType]
  if (!(str in Account.Type)) {
    log(`unknown account type: ${str}`)
    str = Account.Type.CHECKING
  }
  return str as Account.Type
}

export const fromAccountType = (str: Account.Type): ofx4js.AccountType => {
  if (!(str in ofx4js.AccountType)) {
    log(`unknown account type: ${str}`)
    str = Account.Type.CHECKING
  }
  return (ofx4js.AccountType as any)[str]
}

interface GetFinancialAccountParams {
  service: ofx4js.FinancialInstitutionImpl
  login: Login
  account: Account
  intl: InjectedIntl
}

export const getFinancialAccount = ({
  service,
  login,
  account,
  intl,
}: GetFinancialAccountParams): ofx4js.FinancialInstitutionAccount => {
  const { username, password } = checkLogin({ login, intl })
  const accountNumber = account.number
  if (!accountNumber) {
    throw new Error(intl.formatMessage(messages.noAccountNumber))
  }
  let accountDetails

  switch (account.type) {
    case Account.Type.CHECKING:
    case Account.Type.SAVINGS:
    case Account.Type.CREDITLINE:
      const { routing } = account
      if (!routing) {
        throw new Error(intl.formatMessage(messages.noRoutingNumber))
      }
      accountDetails = new ofx4js.BankAccountDetails()
      accountDetails.setAccountNumber(accountNumber)
      accountDetails.setRoutingNumber(routing)
      accountDetails.setAccountType(fromAccountType(account.type))
      return service.loadBankAccount(accountDetails, username, password)

    case Account.Type.CREDITCARD:
      accountDetails = new ofx4js.CreditCardAccountDetails()
      accountDetails.setAccountNumber(accountNumber)
      accountDetails.setAccountKey(account.key)
      return service.loadCreditCardAccount(accountDetails, username, password)

    default:
      throw new Error('unknown account type')
  }
}

const messages = defineMessages({
  noFid: {
    id: 'ofxService.nofid',
    defaultMessage: "'fid' is not set",
  },
  noOrg: {
    id: 'ofxService.noorg',
    defaultMessage: "'org' is not set",
  },
  noOfx: {
    id: 'ofxService.noofx',
    defaultMessage: "'ofx' is not set",
  },
  noName: {
    id: 'ofxService.noname',
    defaultMessage: "'name' is not set",
  },
  noUsername: {
    id: 'ofxService.nousername',
    defaultMessage: "'username' is not set",
  },
  noPassword: {
    id: 'ofxService.nopassword',
    defaultMessage: "'password' is not set",
  },
  noAccountNumber: {
    id: 'ofxService.noAccountNumber',
    defaultMessage: "'accountNumber' is not set",
  },
  noRoutingNumber: {
    id: 'ofxService.noRoutingNumber',
    defaultMessage: "'routingNumber' is not set",
  },
})
