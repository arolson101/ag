// tslint:disable:no-duplicate-variable
import * as electron from './platform-specific.electron'
import * as native from './platform-specific.native'

declare var _test: typeof electron
declare var _test: typeof native

export * from './platform-specific.electron'
