import { createStandardAction } from 'typesafe-actions'

export const dialogActions = {
  dlg: {
    close: createStandardAction('dlg/close')(),
    bankCreate: createStandardAction('dlg/bankCreate')(),
    bankEdit: createStandardAction('dlg/bankEdit')<{ bankId: string }>(),
  },
}
