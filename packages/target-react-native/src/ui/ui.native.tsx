import { UiContext } from '@ag/core/context'
import { ui as nbUi } from '@ag/ui-nativebase'
import { Dialog } from './Dialog.native'
import { LoadingOverlay } from './LoadingOverlay.native'

export const ui: UiContext = {
  ...nbUi,

  LoadingOverlay,

  Dialog,
}
