import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'

export interface SettingsState {
  error?: Error
  values: Record<string, string>
}

const defaultState: SettingsState = {
  values: {},
}

export const settingsSelectors = {
  getSettingsError: (state: SettingsState) => state.error,
  getSetting: (state: SettingsState) => (key: string, dflt: string): string => {
    if (key in state.values) {
      return state.values[key]
    } else {
      return dflt
    }
  },
}

export const settings = (
  state: SettingsState = defaultState,
  action: CoreAction
): SettingsState => {
  switch (action.type) {
    case getType(actions.settingsLoaded):
      return { ...state, error: undefined, values: action.payload }

    case getType(actions.settingsError):
      return { ...state, error: action.payload }

    case getType(actions.dbLogout):
      return { ...state, error: undefined, values: {} }

    default:
      return state
  }
}
