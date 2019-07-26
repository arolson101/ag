import { ImageUri } from '@ag/util'
import { createStandardAction } from 'typesafe-actions'

export type DialogType = 'login' | 'picture' | 'bank' | 'account' | 'transaction' | 'bill'

export const dialogActions = {
  openDlg: {
    login: createStandardAction('dlg/login')(),
    picture: createStandardAction('dlg/picture')<{
      url: string
      onSelected: (uri: ImageUri) => any
    }>(),
    bankCreate: createStandardAction('dlg/bankCreate')(),
    bankEdit: createStandardAction('dlg/bankEdit')<{ bankId: string }>(),
    accountCreate: createStandardAction('dlg/accountCreate')<{ bankId: string }>(),
    accountEdit: createStandardAction('dlg/accountEdit')<{ accountId: string }>(),
    transactionCreate: createStandardAction('dlg/transactionCreate')<{ accountId: string }>(),
    transactionEdit: createStandardAction('dlg/transactionEdit')<{
      accountId: string
      transactionId: string
    }>(),
    billCreate: createStandardAction('dlg/billCreate')(),
    billEdit: createStandardAction('dlg/billEdit')<{ billId: string }>(),
  },
  closeDlg: createStandardAction('dlg/close')<DialogType>(),
}
