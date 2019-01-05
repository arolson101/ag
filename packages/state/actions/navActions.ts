import { createAsyncAction, createStandardAction } from 'typesafe-actions'

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
  error: Error
}

export const navigate = createAsyncAction(
  'navigate/request',
  'navigate/success',
  'navigate/failure'
)<NavigateRequest, NavigateSuccess, NavigateError>()
