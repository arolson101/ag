import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'
import { nav, navSelectors } from './navReducer'

export const rootReducer = combineReducers({
  nav,
})

export interface RootState extends StateType<typeof rootReducer> {}

export const selectors = {
  isLoading: (state: RootState) => navSelectors.isLoading(state.nav),
  getLoadErrors: (state: RootState) => navSelectors.getLoadErrors(state.nav),
  getUrl: (state: RootState) => navSelectors.getUrl(state.nav),
  getLoadData: (state: RootState) => navSelectors.getLoadData(state.nav),
}
