import { createStandardAction } from 'typesafe-actions'

export const themeActions = {
  setThemeMode: createStandardAction('core/setThemeMode')<'light' | 'dark'>(),
  setThemeColor: createStandardAction('core/setThemeColor')<string>(),
  setPlatform: createStandardAction('core/setPlatform')<'pc' | 'mac' | 'linux'>(),
}
