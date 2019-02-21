import { UiContext } from '@ag/app'
import { ui as nbUi } from '@ag/ui-nativebase'
import { Dialog, DialogBody, DialogFooter } from './Dialog.native'
import { LoadingOverlay } from './LoadingOverlay.native'

export const ui: UiContext = {
  ...nbUi,

  LoadingOverlay,

  Dialog,
  DialogBody,
  DialogFooter,
}
