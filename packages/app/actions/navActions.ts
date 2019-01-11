import { createAsyncAction } from 'typesafe-actions'

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

export const navActions = {
  navigate: createAsyncAction('navigate/request', 'navigate/success', 'navigate/failure')<
    NavigateRequest,
    NavigateSuccess,
    NavigateError
  >(),
}
