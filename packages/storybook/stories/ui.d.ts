import * as electron from './ui.electron'
import * as native from './ui.native'

declare foo: typeof electron
declare foo: typeof native

export * from electron
