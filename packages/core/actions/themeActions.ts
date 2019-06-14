import { createStandardAction } from 'typesafe-actions'

export const themeActions = {
  setTheme: createStandardAction('core/setTheme')<'light' | 'dark'>(),
  setThemeColor: createStandardAction('core/setThemeColor')<string>(),
  setPlatform: createStandardAction('core/setPlatform')<'pc' | 'mac' | 'linux'>(),
}
