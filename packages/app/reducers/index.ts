import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'
import { nav, navSelectors } from './navReducer'

export const rootReducer = combineReducers({
  nav,
})

export interface AppState extends StateType<typeof rootReducer> {}

export const selectors = {
  isLoading: (state: AppState) => navSelectors.isLoading(state.nav),
  getLoadErrors: (state: AppState) => navSelectors.getLoadErrors(state.nav),
  getUrl: (state: AppState) => navSelectors.getUrl(state.nav),
  getLoadData: <T extends {}>(state: AppState) => navSelectors.getLoadData<T>(state.nav),
}
