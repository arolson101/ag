import { createStandardAction } from 'typesafe-actions'

export const settingsActions = {
  settingsLoaded: createStandardAction('core/settingsLoaded')<Record<string, string>>(),
  settingsError: createStandardAction('core/settingsError')<Error>(),
}
