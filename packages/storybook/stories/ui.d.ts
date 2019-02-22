import * as electron from './ui.electron'
import * as native from './ui.native'

declare var foo: typeof electron
// declare var foo: typeof native

export * from './ui.electron'
