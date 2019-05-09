import { createStandardAction } from 'typesafe-actions'

export const settingsActions = {
  settingsInit: createStandardAction('core/settingsInit')<Record<string, string>>(),
  settingsError: createStandardAction('core/settingsError')<Error>(),
  settingsSetValue: createStandardAction('core/settingsSetValue')<{ key: string; value: string }>(),
}
