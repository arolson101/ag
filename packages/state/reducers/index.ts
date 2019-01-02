import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'
import { nav, navSelectors } from './navReducer'

export const rootReducer = combineReducers({
  nav,
})

export interface RootState extends StateType<typeof rootReducer> {}

export const selectors = {
  isLoading: (state: RootState) => navSelectors.isLoading(state.nav),
  loadError: (state: RootState) => navSelectors.loadError(state.nav),
}
