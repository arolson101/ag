import assert from 'assert'
import { getType } from 'typesafe-actions'
import { actions, RootAction } from '../actions'

const initialState = {
  loading: false,
  error: undefined as Error | undefined,
  url: undefined as string | undefined,
  data: {} as object,
}

type NavState = typeof initialState

export const navSelectors = {
  isLoading: (state: NavState) => state.loading,
  getLoadError: (state: NavState) => state.error,
  getUrl: (state: NavState) => state.url,
  getLoadData: (state: NavState) => state.data,
}

export const nav = (state: NavState = initialState, action: RootAction): NavState => {
  switch (action.type) {
    case getType(actions.nav.navigate.request):
      return {
        ...state,
        error: undefined,
        data: {},
        url: action.payload.url,
        loading: true,
      }

    case getType(actions.nav.navigate.success):
      assert(state.url === action.payload.url)
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      }

    case getType(actions.nav.navigate.failure):
      assert(state.url === action.payload.url)
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }

    default:
      return state
  }
}
