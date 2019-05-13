import { SystemCallbacks } from '@ag/core/context'
import { CoreStore } from '@ag/core/reducers'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import { createMemoryHistory } from 'history'
import { createStore } from '../store'
import { getImageFromLibrary, openCropper, scaleImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

export const hist = createMemoryHistory()

export const sys: SystemCallbacks = {
  openDb,
  deleteDb,
  getImageFromLibrary,
  openCropper,
  scaleImage,
}

export const store = createStore(hist, { sys, online, ui }) as CoreStore
