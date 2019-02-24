import { ImageSource } from '@ag/lib-util'
import { createStandardAction } from 'typesafe-actions'

export type DialogType = 'login' | 'picture' | 'bank' | 'account'

export const dialogActions = {
  openDlg: {
    login: createStandardAction('dlg/login')(),
    picture: createStandardAction('dlg/picture')<{
      url: string
      onSelected: (uri: ImageSource) => any
    }>(),
    bankCreate: createStandardAction('dlg/bankCreate')(),
    bankEdit: createStandardAction('dlg/bankEdit')<{ bankId: string }>(),
    accountCreate: createStandardAction('dlg/accountCreate')<{ bankId: string }>(),
    accountEdit: createStandardAction('dlg/accountEdit')<{ bankId: string; accountId: string }>(),
  },
  closeDlg: createStandardAction('dlg/close')<DialogType>(),
}
