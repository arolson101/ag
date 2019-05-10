import { SystemCallbacks } from '@ag/core/context'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import { createStore } from '../store'
import { getImageFromLibrary, openCropper, scaleImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

export const sys: SystemCallbacks = {
  openDb,
  deleteDb,
  getImageFromLibrary,
  openCropper,
  scaleImage,
}

export const store = createStore({ sys, online, ui })
