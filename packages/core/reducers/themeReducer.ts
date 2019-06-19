import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'

export type PlatformName = 'pc' | 'mac' | 'linux'

export interface ThemeState {
  theme: 'light' | 'dark'
  color: string
  platform: PlatformName
}

export const initialThemeState: ThemeState = {
  theme: 'light',
  color: '#3C3C3C',
  platform: 'pc',
}

export const themeSelectors = {
  getTheme: (state: ThemeState) => state.theme,
  getThemeColor: (state: ThemeState) => state.color,
  getPlatform: (state: ThemeState) => state.platform,
}

export const theme = (state: ThemeState = initialThemeState, action: CoreAction): ThemeState => {
  switch (action.type) {
    case getType(actions.setTheme):
      return { ...state, theme: action.payload }

    case getType(actions.setThemeColor):
      return { ...state, color: action.payload }

    case getType(actions.setPlatform):
      return { ...state, platform: action.payload }

    default:
      return state
  }
}
