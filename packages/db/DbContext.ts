import { Online } from '@ag/online'
import { InjectedIntl as IntlContext } from 'react-intl'
import { Connection, ConnectionOptions } from 'typeorm'
import {
  AccountRepository,
  BankRepository,
  SettingsRepository,
  TransactionRepository,
} from './repositories'

export interface AppDb {
  connection: Connection
  settingsRepository: SettingsRepository
  banksRepository: BankRepository
  accountsRepository: AccountRepository
  transactionsRepository: TransactionRepository
}

export interface DbContext {
  isLoggedIn: () => boolean
  getAppDb: () => AppDb
  online: Online
  intl: IntlContext
  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>
}
