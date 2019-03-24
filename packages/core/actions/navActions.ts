import { createStandardAction } from 'typesafe-actions'

export const navActions = {
  nav: {
    home: createStandardAction('nav/home')(),
    accounts: createStandardAction('nav/accounts')(),
    account: createStandardAction('nav/account')<{ accountId: string }>(),
    bills: createStandardAction('nav/bills')(),
    budgets: createStandardAction('nav/budgets')(),
    calendar: createStandardAction('nav/calendar')(),
  },
}
