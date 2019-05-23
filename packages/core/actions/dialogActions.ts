import { ImageString } from '@ag/util'
import { createStandardAction } from 'typesafe-actions'

export type DialogType = 'login' | 'picture' | 'bank' | 'account'

export const dialogActions = {
  openDlg: {
    login: createStandardAction('dlg/login')(),
    picture: createStandardAction('dlg/picture')<{
      url: string
      onSelected: (uri: ImageString) => any
    }>(),
    bankCreate: createStandardAction('dlg/bankCreate')(),
    bankEdit: createStandardAction('dlg/bankEdit')<{ bankId: string }>(),
    accountCreate: createStandardAction('dlg/accountCreate')<{ bankId: string }>(),
    accountEdit: createStandardAction('dlg/accountEdit')<{ accountId: string }>(),
    accountDelete: createStandardAction('dlg/accountDelete')<{ accountId: string }>(),
  },
  closeDlg: createStandardAction('dlg/close')<DialogType>(),
}
