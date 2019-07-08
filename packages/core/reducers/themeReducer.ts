import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'

export interface ThemeState {
  mode: ThemeMode
  color: string
  platform: PlatformName
}

export const initialThemeState: ThemeState = {
  mode: 'light',
  color: '#3C3C3C',
  platform: 'pc',
}

export const themeSelectors = {
  themeMode: (state: ThemeState) => state.mode,
  themeColor: (state: ThemeState) => state.color,
  platform: (state: ThemeState) => state.platform,
}

export const theme = (state: ThemeState = initialThemeState, action: CoreAction): ThemeState => {
  switch (action.type) {
    case getType(actions.setThemeMode):
      return { ...state, mode: action.payload }

    case getType(actions.setThemeColor):
      return { ...state, color: action.payload }

    case getType(actions.setPlatform):
      return { ...state, platform: action.payload }

    default:
      return state
  }
}
