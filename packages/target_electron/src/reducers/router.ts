import { actions, AppAction } from '@ag/app'
import { createBrowserHistory, History } from 'history'
import { parse, stringify } from 'query-string'
import { getType } from 'typesafe-actions'

export interface RouterState {
  history: History
}

export const history = createBrowserHistory()

const initialState = {
  history,
}

export const router = (state: RouterState = initialState, action: AppAction): RouterState => {
  switch (action.type) {
    case getType(actions.nav.push):
      state.history.push(
        history.createHref({
          pathname: '/' + action.payload.id,
          hash: '',
          search: action.payload.props ? stringify(action.payload.props) : '',
          state: {},
        })
      )
      break

    case getType(actions.nav.pop):
      state.history.goBack()
      break
  }
  return state
}
