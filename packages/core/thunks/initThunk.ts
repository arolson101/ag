import { CoreThunk } from './CoreThunk'
import { dbThunks } from './dbThunks'

const init = (): CoreThunk =>
  async function _init(dispatch, getState) {
    dispatch(dbThunks.dbInit())
  }

export const initThunk = {
  init,
}
