import { UiContext } from '@ag/app'
import { ui as nbUi } from '@ag/ui-nativebase'

export const ui: UiContext = {
  ...nbUi,

  LoadingOverlay: null as any,

  Dialog: null as any,
  DialogBody: null as any,
  DialogFooter: null as any,
}
