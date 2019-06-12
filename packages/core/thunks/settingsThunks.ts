import { Setting } from '@ag/db/entities'
import { actions } from '../actions'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'

const settingsToRecord = (settings: Setting[]): Record<string, string> =>
  settings.reduce((obj, setting) => ({ ...obj, [setting.key]: setting.value }), {})

const settingsInit = (): CoreThunk =>
  async function _settingsInit(dispatch, getState) {
    try {
      const { settingsRepository } = selectors.getAppDb(getState())
      const settings = await settingsRepository.all()
      const x = settingsToRecord(settings)
      dispatch(actions.settingsLoaded(x))
    } catch (error) {
      dispatch(actions.settingsError(error))
    }
  }

const settingsSetValue = (key: string, value: string): CoreThunk =>
  async function _settingsSetValue(dispatch, getState) {
    try {
      const { settingsRepository } = selectors.getAppDb(getState())
      await settingsRepository.set(key, value)

      const settings = await settingsRepository.all()
      const x = settingsToRecord(settings)
      dispatch(actions.settingsLoaded(x))
    } catch (error) {
      dispatch(actions.settingsError(error))
    }
  }

export const settingsThunks = {
  settingsInit,
  settingsSetValue,
}
