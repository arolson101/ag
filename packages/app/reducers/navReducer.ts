import { getType } from 'typesafe-actions'
import { actions, RootAction } from '../actions'

const initialState = {
  loading: false,
  errors: undefined as ReadonlyArray<Error> | undefined,
  url: '' as string,
  data: {} as object,
}

type NavState = typeof initialState

export const navSelectors = {
  isLoading: (state: NavState) => state.loading,
  getLoadErrors: (state: NavState) => state.errors,
  getUrl: (state: NavState) => state.url,
  getLoadData: <T extends {}>(state: NavState) => state.data as T,
}

export const nav = (state: NavState = initialState, action: RootAction): NavState => {
  switch (action.type) {
    case getType(actions.nav.navigate.request):
      return {
        ...state,
        loading: true,
      }

    case getType(actions.nav.navigate.success):
      return {
        ...state,
        loading: false,
        url: action.payload.url,
        errors: undefined,
        data: action.payload.data,
      }

    case getType(actions.nav.navigate.failure):
      return {
        ...state,
        loading: false,
        url: action.payload.url,
        errors: action.payload.errors,
        data: {},
      }

    default:
      return state
  }
}
