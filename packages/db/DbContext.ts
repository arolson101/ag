import { CoreStore } from '@ag/core/reducers'
import { Online } from '@ag/online'
import { InjectedIntl as IntlContext } from 'react-intl'
import { Connection, ConnectionOptions } from 'typeorm'

export interface DbContext {
  store: CoreStore
  online: Online
  intl: IntlContext
  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>
}
