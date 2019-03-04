import { UiContext } from '@ag/core'
import { ui as nbUi } from '@ag/ui-nativebase'
import { Dialog, DialogBody } from './Dialog.native'
import { LoadingOverlay } from './LoadingOverlay.native'

export const ui: UiContext = {
  ...nbUi,

  LoadingOverlay,

  Dialog,
  DialogBody,
}
