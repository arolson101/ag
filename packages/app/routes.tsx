import { actions } from './actions'
import { BankEditPage, HomePage, LoginPage } from './pages'

export interface RouteConfig {
  [path: string]: React.ComponentType<any> | React.ComponentType<void>
}

export const go = {
  login: (props: LoginPage.Props) => actions.nav.push({ id: LoginPage.id, props }),
  home: (props: HomePage.Props) => actions.nav.push({ id: HomePage.id, props }),
  bankCreate: (props: BankEditPage.Props) => actions.nav.push({ id: BankEditPage.id, props }),
  bankEdit: (props: BankEditPage.Props) => actions.nav.push({ id: BankEditPage.id, props }),
}

export const loggedOutRoutes: RouteConfig = {
  ['/']: LoginPage,
  [LoginPage.id]: LoginPage,
}

export const loggedInRoutes: RouteConfig = {
  ['/']: HomePage,
  [HomePage.id]: HomePage,
  [BankEditPage.id]: BankEditPage,
}

// export const logout = createStandardAction('nav/logout')()

// export const home = createStandardAction('nav/home')()
// export const accounts = createStandardAction('nav/accounts')()
// export const budgets = createStandardAction('nav/budgets')()

// export const bank = {
//   create: createStandardAction('nav/bank/create')(),
//   read: createStandardAction('nav/bank/read')<{ bankId: string }>(),
//   update: createStandardAction('nav/bank/update')<{ bankId: string }>(),
//   delete: createStandardAction('nav/bank/delete')<{ bankId: string }>(),
// }

// export const account = {
//   create: createStandardAction('nav/account/create')(),
//   read: createStandardAction('nav/account/read')<{ accountId: string }>(),
//   update: createStandardAction('nav/account/update')<{ accountId: string }>(),
//   delete: createStandardAction('nav/account/delete')<{ accountId: string }>(),
// }

// export const transaction = {
//   create: createStandardAction('nav/tx/create')(),
//   read: createStandardAction('nav/tx/read')<{ txId: string }>(),
//   update: createStandardAction('nav/tx/update')<{ txId: string }>(),
//   delete: createStandardAction('nav/tx/delete')<{ txId: string }>(),
// }
