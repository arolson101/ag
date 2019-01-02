import { RootAction, actions } from '../actions'
import { getType, StateType } from 'typesafe-actions'

const initialState = {
  loading: false,
  loadError: undefined as Error | undefined,
}

export const navSelectors = {
  isLoading: (state: NavState) => state.loading,
  loadError: (state: NavState) => state.loadError,
}

export const nav = (state = initialState, action: RootAction) => {
  switch (action.type) {
    case getType(actions.nav.loading.request):
      return { ...state, loading: true, loadError: undefined }
    case getType(actions.nav.loading.success):
      return { ...state, loading: false }
    case getType(actions.nav.loading.failure):
      return { ...state, loading: false, loadError: action.payload }
    default:
      return state
  }
}

type NavState = StateType<typeof nav>
