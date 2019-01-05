import { createRoute, EpicType } from '@ag/state'
import { DocumentNode } from 'graphql'
import { LoginPage } from './pages/LoginPage'

// export const login = createStandardAction('nav/login')()
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

// export const loading = createAsyncAction(
//   'nav/loading/request',
//   'nav/loading/success',
//   'nav/loading/failure'
// )<void, any, Error>()

export interface PageQuery<Params = void> extends DocumentNode {
  __tag?: Params
}

interface RouteComponent<Params> {
  url: string
  query: PageQuery<Params>
}

export const routeHandlers: EpicType[] = []

const addRouteComponent = <T>(page: RouteComponent<T>) => {
  const { ac, eh } = createRoute<T>(page.url, page.query)
  routeHandlers.push(eh)
  return ac
}

export const routes = {
  login: addRouteComponent(LoginPage),
}

// routes.login()