import { createStandardAction } from 'typesafe-actions'

export const navActions = {
  nav: {
    home: createStandardAction('nav/home')(),
    bank: createStandardAction('nav/bank')<{ bankId: string }>(),
  },
}
