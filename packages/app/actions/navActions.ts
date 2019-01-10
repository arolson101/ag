import { createAsyncAction, createStandardAction } from 'typesafe-actions'
import { LoginPage } from '../pages'

export interface NavigateRequest<P = {}> {
  url: string
  params?: P
}

export interface NavigateSuccess<D extends object = {}> {
  url: string
  data: D
}

export interface NavigateError {
  url: string
  errors: ReadonlyArray<Error>
}

export const nav = {
  navigate: createAsyncAction('navigate/request', 'navigate/success', 'navigate/failure')<
    NavigateRequest,
    NavigateSuccess,
    NavigateError
  >(),

  login: createStandardAction('nav/login')<LoginPage.Params>(),
}
