import { createStandardAction } from 'typesafe-actions'

export const navActions = {
  nav: {
    login: createStandardAction('nav/login')(),
    home: createStandardAction('nav/home')(),
    bank: createStandardAction('nav/bank')<{ bankId: string }>(),
    bankCreate: createStandardAction('nav/bankCreate')(),
    bankEdit: createStandardAction('nav/bankEdit')<{ bankId: string }>(),
  },
}
