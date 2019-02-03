import { createStandardAction } from 'typesafe-actions'

export const dialogActions = {
  dlg: {
    close: createStandardAction('dlg/close')(),

    mounted: createStandardAction('dlg/mounted')<{ componentId: string }>(),
    unmounted: createStandardAction('dlg/unmounted')<{ componentId: string }>(),

    login: createStandardAction('dlg/login')(),
    bankCreate: createStandardAction('dlg/bankCreate')(),
    bankEdit: createStandardAction('dlg/bankEdit')<{ bankId: string }>(),
    accountCreate: createStandardAction('dlg/accountCreate')<{ bankId: string }>(),
    accountEdit: createStandardAction('dlg/accountEdit')<{ bankId: string; accountId: string }>(),
  },
}
