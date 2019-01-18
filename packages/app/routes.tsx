import { BankEditPage, HomePage, LoginPage } from './pages'

export interface RouteConfig {
  [path: string]: React.ComponentType<any> | React.ComponentType<void>
}

export const routes: RouteConfig = {
  ['/']: LoginPage,
  [LoginPage.id]: LoginPage,
  [HomePage.id]: HomePage,
  [BankEditPage.id]: BankEditPage,
}

export interface AppRouteFunction {
  (id: typeof LoginPage.id, props: LoginPage.Props): any
  (id: typeof HomePage.id, props: HomePage.Props): any
  (id: typeof BankEditPage.id, props: BankEditPage.Props): any
}

export type AppNavDispatch =
  | { id: typeof LoginPage.id; props: LoginPage.Props }
  | { id: typeof HomePage.id; props: HomePage.Props }
  | { id: typeof BankEditPage.id; props: BankEditPage.Props }

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
